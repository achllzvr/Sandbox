<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class PasswordResetLinkController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'sentEmail' => session('sent_email'),
        ]);
    }

    /**
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->input('email');
        $credentials = ['email' => $email];

        try {
            $status = Password::sendResetLink($credentials);

            if ($status === Password::RESET_LINK_SENT) {
                return back()->with('sent_email', $email);
            }

            if ($status === Password::RESET_THROTTLED) {
                $this->sendFreshResetLink($credentials);

                return back()->with('sent_email', $email);
            }

            // Do not reveal whether the account exists.
            if ($status === Password::INVALID_USER) {
                Log::info('Password reset requested for unknown email.', ['email' => $email]);

                return back()->with('sent_email', $email);
            }

            throw ValidationException::withMessages([
                'email' => [trans($status)],
            ]);
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            Log::error('Password reset email failed.', [
                'email' => $email,
                'message' => $exception->getMessage(),
            ]);

            throw ValidationException::withMessages([
                'email' => 'We could not send the reset email. Please try again in a moment.',
            ]);
        }
    }

    private function sendFreshResetLink(array $credentials): void
    {
        $broker = Password::broker();
        $user = $broker->getUser($credentials);

        if (! $user instanceof CanResetPassword) {
            return;
        }

        $token = $broker->createToken($user);
        $user->sendPasswordResetNotification($token);
    }
}
