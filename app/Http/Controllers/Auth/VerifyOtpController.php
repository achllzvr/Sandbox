<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\OtpService;
use App\Providers\RouteServiceProvider;

class VerifyOtpController extends Controller
{
    public function show(Request $request)
    {
        return request()->user()->hasVerifiedEmail()
                    ? redirect()->intended(RouteServiceProvider::HOME)
                    : Inertia::render('Auth/VerifyOtp', ['status' => session('status')]);
    }

    public function verify(Request $request, OtpService $otpService)
    {
        $request->validate([
            'otp' => ['required', 'string', 'size:6']
        ]);

        try {
            $otpService->verifyOtp($request->user(), $request->otp);
            return redirect()->intended(RouteServiceProvider::HOME)->with('success', 'Email successfully verified.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['otp' => $e->getMessage()]);
        }
    }

    public function resend(Request $request, OtpService $otpService)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(RouteServiceProvider::HOME);
        }

        $otpService->sendEmailVerificationOtp($request->user());

        return redirect()->back()->with('status', 'verification-link-sent');
    }
}

