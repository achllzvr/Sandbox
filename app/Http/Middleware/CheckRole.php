<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    private const ROLE_ALIASES = [
        'content_creator' => 'content_creator',
    ];

    public function handle(
        Request $request,
        Closure $next,
        string $role
    ): mixed {

        if (! $request->user()) {
            return redirect()->route('login');
        }

        $user = $request->user();

        // Banned
        if ($user->status === 'inactive') {
            auth()->logout();
            return redirect()->route('login')
                ->withErrors(['email' =>
                    'Your account has been disabled. 
                     Contact an administrator.'
                ]);
        }

        // Declined teacher
        if ($user->status === 'declined') {
            auth()->logout();
            return redirect()->route('login')
                ->withErrors(['email' =>
                    'Your teacher registration was declined. 
                     Contact support for assistance.'
                ]);
        }

        // Pending teacher accessing non-teacher routes
        if ($user->status === 'pending_verification'
            && $role !== 'teacher') {
            auth()->logout();
            return redirect()->route('login')
                ->withErrors(['email' =>
                    'Your account is pending admin verification.'
                ]);
        }

        $normalizedRole = self::ROLE_ALIASES[$role] ?? $role;
        $normalizedUserRole = self::ROLE_ALIASES[$user->role] ?? $user->role;

        // Wrong role
        if ($normalizedUserRole !== $normalizedRole) {
            abort(403, 'Unauthorized.');
        }

        return $next($request);
    }
}