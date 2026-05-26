<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\StudentRegisterRequest;
use App\Mail\OtpMail;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(StudentRegisterRequest $request)
    {
        $user = User::create([
            'first_name'  => $request->first_name,
            'last_name'   => $request->last_name,
            'email'       => $request->email,
            'password'    => Hash::make($request->password),
            'birthday'    => $request->birthday,
            'contact_no'  => $request->contact_no,
            'affiliation' => $request->affiliation,
            'role'        => 'user',
            'status'      => 'active',
            // email_verified_at is NULL until OTP verified
        ]);

        // Generate OTP
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

        $email = $user->email;
        $firstName = $user->first_name;

        dispatch(function () use ($email, $otp, $firstName) {
            Mail::to($email)->send(new OtpMail($otp, $firstName));
        })->afterResponse();

        Auth::login($user);

        return redirect()->route('verification.notice');
    }
}
