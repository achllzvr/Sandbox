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
        // Check status before credentials
        $user = \App\Models\User::where('email', $request->email)
                    ->first();

        if ($user) {
            if ($user->status === 'inactive') {
                throw \Illuminate\Validation\ValidationException
                    ::withMessages([
                        'email' => 'Your account has been 
                                    disabled. Contact an 
                                    administrator.',
                    ]);
            }

            if ($user->status === 'declined') {
                throw \Illuminate\Validation\ValidationException
                    ::withMessages([
                        'email' => 'Your teacher registration 
                                    was declined.',
                    ]);
            }
            // pending_verification teachers CAN log in —
            // middleware gates their routes, not login itself.
        }

        $request->authenticate();
        $request->session()->regenerate();

        $user = auth()->user();

        // Always enforce role-based redirection on login
        return match ($user->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'staff' => redirect()->route('creator.certifications.index'),
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
