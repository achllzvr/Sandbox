<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role)
    {
        if (!session()->has('user_id')) {
            return redirect()->route('login')->withErrors(['email' => 'Please login to continue.']);
        }

        if (session('role') !== $role) {
            abort(403, 'Unauthorized Access.');
        }

        return $next($request);
    }
}