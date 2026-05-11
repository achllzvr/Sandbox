<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class OtpVerificationController extends Controller
{
    // GET /verification/notice
    public function show()
    {
        $user = auth()->user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/VerifyOtp', [
            'email' => $user->email,
        ]);
    }

    // POST /verify-otp
    public function verify(Request $request)
    {
        $request->validate([
            'otp' => ['required','string','size:6',
                      'regex:/^[0-9]{6}$/'],
        ]);

        $user    = auth()->user();
        $otpData = session('otp_data');

        // No session data
        if (! $otpData) {
            return back()->withErrors([
                'otp' => 'Session expired. 
                          Please request a new code.',
            ]);
        }

        // Session belongs to a different email (edge case)
        if ($otpData['email'] !== $user->email) {
            session()->forget('otp_data');
            return back()->withErrors([
                'otp' => 'Invalid session. Please log in again.',
            ]);
        }

        // Too many attempts
        if ($otpData['attempts'] >= 5) {
            session()->forget('otp_data');
            return back()->withErrors([
                'otp' => 'Too many failed attempts. 
                          Request a new code.',
            ]);
        }

        // Increment attempts in session
        $otpData['attempts']++;
        session(['otp_data' => $otpData]);

        // Expired
        if (now()->timestamp > $otpData['expires_at']) {
            session()->forget('otp_data');
            return back()->withErrors([
                'otp' => 'Your code has expired. 
                          Request a new one.',
            ]);
        }

        // Wrong code
        if ($request->otp !== $otpData['code']) {
            $remaining = 5 - $otpData['attempts'];
            return back()->withErrors([
                'otp' => "Incorrect code. 
                          {$remaining} attempt(s) remaining.",
            ]);
        }

        // ✅ Correct — mark email as verified
        $user->forceFill(['email_verified_at' => now()])->save();
        session()->forget('otp_data');

        // Log the user out so they must log in with email + password
        auth()->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')
            ->with('status', 'Email verified! Please log in to continue. 🎉');
    }

    // POST /email/verification-notification
    public function resend(Request $request)
    {
        $user = auth()->user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        $otpData = session('otp_data');

        // Max 3 resends
        if ($otpData && $otpData['resend_count'] >= 3) {
            return back()->withErrors([
                'otp' => 'Maximum resends reached. 
                          Contact support if you need help.',
            ]);
        }

        $newOtp        = (string) random_int(100000, 999999);
        $resendCount   = ($otpData['resend_count'] ?? 0) + 1;

        session([
            'otp_data' => [
                'code'         => $newOtp,
                'email'        => $user->email,
                'expires_at'   => now()->addMinutes(10)
                                    ->timestamp,
                'attempts'     => 0,
                'resend_count' => $resendCount,
            ]
        ]);

        Mail::to($user->email)
            ->send(new OtpMail($newOtp, $user->first_name));

        return back()->with('success',
            'A new verification code has been sent.');
    }
}
