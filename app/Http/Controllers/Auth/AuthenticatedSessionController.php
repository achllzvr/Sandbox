<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $user = auth()->user();

        // Teacher specific restrictions
        if ($user->role === 'teacher') {
            if ($user->status === 'pending_verification') {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                throw \Illuminate\Validation\ValidationException::withMessages([
                    'email' => 'Your affiliate account is still pending verification by the Sandbox Administration Team.',
                ]);
            }

            if ($user->status === 'rejected' || $user->status === 'declined') {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                throw \Illuminate\Validation\ValidationException::withMessages([
                    'email' => 'Your affiliate verification request has been rejected. Please contact the administrator.',
                ]);
            }
        }

        // Global inactive check
        if ($user->status === 'inactive') {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => 'Your account has been disabled. Contact an administrator.',
            ]);
        }

        $request->session()->regenerate();

        $user = auth()->user();

        // Always enforce role-based redirection on login
        return match ($user->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'content_creator', 'content_creator' => redirect()->route('creator.certifications.index'),
            'teacher' => redirect()->route('teacher.dashboard'),
            default => redirect()->intended(\App\Providers\RouteServiceProvider::HOME),
        };
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('welcome');
    }
}
