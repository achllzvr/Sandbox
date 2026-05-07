<?php

namespace App\Http\Controllers;

use App\Mail\EmailVerificationMail;
use App\Mail\WelcomeUserMail;
use App\Models\EmailVerification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return redirect()->back()->withErrors([
                'email' => 'Invalid email or password.',
            ])->withInput();
        }

        if (! $user->is_active) {
            return redirect()->back()->withErrors([
                'email' => 'Your account is currently deactivated. Contact the administrator.',
            ]);
        }

        if ($user->role === 'user' && ! $user->hasVerifiedEmail()) {
            return redirect()->route('verification.notice')
                ->with('verification_email', $user->email)
                ->withErrors([
                    'email' => 'Your account is not verified yet. Please verify your email before logging in.',
                ]);
        }

        session([
            'user_id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'full_name' => $user->first_name . ' ' . $user->last_name,
            'email' => $user->email,
            'role' => $user->role,
        ]);

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        if ($user->role === 'staff') {
            return redirect()->route('staff.dashboard');
        }

        return redirect()->route('user.dashboard');
    }

    public function logout()
    {
        session()->flush();
        session()->regenerateToken();

        return redirect()->route('login');
    }

    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'birthday' => 'required|date',
            'contact_no' => 'required|string|max:20',
            'affiliation' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'birthday' => $request->birthday,
            'contact_no' => $request->contact_no,
            'affiliation' => $request->affiliation,
            'role' => 'user',
        ]);

        $otp = (string) rand(100000, 999999);

        EmailVerification::create([
            'user_id' => $user->id,
            'otp' => Hash::make($otp),
            'expires_at' => now()->addMinutes(5),
        ]);

        Mail::to($user->email)->queue(new EmailVerificationMail($user, $otp));

        return redirect()->route('verification.notice')
            ->with('verification_email', $user->email)
            ->with('success', 'Registration successful! A verification code has been sent to your email.');
    }

    public function showVerificationForm(Request $request)
    {
        $email = session('verification_email') ?? $request->query('email', '');

        return view('auth.verify-email', compact('email'));
    }

    public function verifyEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || $user->hasVerifiedEmail()) {
            return redirect()->route('login')->with('success', 'Account already verified. Please login.');
        }

        $verification = EmailVerification::where('user_id', $user->id)
            ->latest()
            ->first();

        if (! $verification || now()->greaterThan($verification->expires_at)) {
            return back()->withErrors(['otp' => 'Your verification code has expired. Please resend a new code.'])->withInput();
        }

        if ($verification->attempts >= 5) {
            return back()->withErrors(['otp' => 'Too many incorrect attempts. Please request a new code.'])->withInput();
        }

        if (! Hash::check($request->otp, $verification->otp)) {
            $verification->increment('attempts');
            return back()->withErrors(['otp' => 'The OTP is invalid. Please try again.'])->withInput();
        }

        $user->markEmailAsVerified();
        EmailVerification::where('user_id', $user->id)->delete();

        Mail::to($user->email)->queue(new WelcomeUserMail($user));

        return redirect()->route('login')->with('success', 'Your email has been verified. You may now sign in.');
    }

    public function resendVerification(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || $user->hasVerifiedEmail()) {
            return redirect()->route('login');
        }

        $verification = EmailVerification::firstOrNew([
            'user_id' => $user->id,
        ]);

        if ($verification->exists && $verification->resend_count >= 3) {
            return back()->withErrors(['email' => 'You have reached the resend limit. Please wait a few minutes and try again.']);
        }

        $otp = (string) rand(100000, 999999);
        $verification->fill([
            'otp' => Hash::make($otp),
            'expires_at' => now()->addMinutes(5),
            'resend_count' => $verification->resend_count + 1,
            'attempts' => 0,
        ])->save();

        Mail::to($user->email)->queue(new EmailVerificationMail($user, $otp));

        return back()->with('success', 'A new verification code has been sent to your email.');
    }
}
