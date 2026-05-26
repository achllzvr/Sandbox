<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AcceptInviteRequest;
use App\Mail\OtpMail;
use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AcceptInvitationController extends Controller
{
    public function show($token)
    {
        $invitation = UserInvitation::where('token', $token)->firstOrFail();

        return Inertia::render('Auth/AcceptInvite', [
            'token' => $token,
            'email' => $invitation->email,
            'role'  => $invitation->role,
        ]);
    }

    public function store(AcceptInviteRequest $request)
    {
        $invitation = UserInvitation::where('token', $request->token)->firstOrFail();

        // Create the user without email_verified_at (NULL) — same as student flow
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $invitation->email,
            'password'   => Hash::make($request->password),
            'birthday'   => $request->birthday,
            'contact_no' => $request->contact_no,
            'role'       => $invitation->role,
            'status'     => 'active',
            // email_verified_at is NULL until OTP verified
        ]);

        // Delete the invitation token (single-use)
        $invitation->delete();

        // Generate OTP — same pattern as RegisteredUserController
        $otp = (string) random_int(100000, 999999);

        // Store in SESSION only — no DB table
        session([
            'otp_data' => [
                'code'         => $otp,
                'email'        => $user->email,
                'expires_at'   => now()->addMinutes(10)->timestamp,
                'attempts'     => 0,
                'resend_count' => 0,
            ]
        ]);

        $email     = $user->email;
        $firstName = $user->first_name;

        dispatch(function () use ($email, $otp, $firstName) {
            Mail::to($email)->send(new OtpMail($otp, $firstName));
        })->afterResponse();

        Auth::login($user);

        return redirect()->route('verification.notice');
    }
}
