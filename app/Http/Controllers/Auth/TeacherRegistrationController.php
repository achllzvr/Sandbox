<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\TeacherRegisterRequest;
use App\Mail\OtpMail;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class TeacherRegistrationController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/RegisterTeacher');
    }

    public function store(TeacherRegisterRequest $request)
    {
        // Store credential file
        $credentialPath = $request
            ->file('credential_proof')
            ->store('credentials', 'public');

        $user = User::create([
            'first_name'  => $request->first_name,
            'last_name'   => $request->last_name,
            'email'       => $request->email,
            'password'    => Hash::make($request->password),
            'birthday'    => $request->birthday,
            'contact_no'  => $request->contact_no,
            'affiliation' => $request->affiliation,
            'role'        => 'teacher',
            'status'      => 'pending_verification',
            'institutional_credentials_url' => $credentialPath,
            // email_verified_at is NULL until OTP verified
        ]);

        $otp = (string) random_int(100000, 999999);

        session([
            'otp_data' => [
                'code'         => $otp,
                'email'        => $user->email,
                'expires_at'   => now()->addMinutes(10)
                                    ->timestamp,
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
        // status stays 'pending_verification' even after OTP.
        // Only admin can set it to 'active'.
    }
}
