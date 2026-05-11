<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureEmailOtpVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Admin accounts are created manually — skip OTP verification
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }

        if (!$request->user() ||
            !$request->user()->hasVerifiedEmail()) {
            return $request->expectsJson()
                    ? abort(403, 'Your email address is not verified.')
                    : redirect()->route('verification.notice');
        }

        return $next($request);
    }
}

