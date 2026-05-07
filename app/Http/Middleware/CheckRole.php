<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role)
    {
        if (! session()->has('user_id')) {
            return redirect()->route('login')->withErrors(['email' => 'Please login to continue.']);
        }

        if (session('role') !== $role) {
            abort(403, 'Unauthorized Access.');
        }

        $user = User::find(session('user_id'));
        if (! $user || ! $user->is_active) {
            session()->flush();
            return redirect()->route('login')->withErrors([
                'email' => 'Your account is disabled. Contact the administrator.',
            ]);
        }

        if ($role === 'user' && ! $user->hasVerifiedEmail()) {
            session()->flush();
            return redirect()->route('login')->withErrors([
                'email' => 'Please verify your account before accessing the platform.',
            ]);
        }

        return $next($request);
    }
}