<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\WelcomeUserMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;

class RegisterController extends Controller
{
    public function showRegisterForm()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'birthday' => ['required', 'date'],
            'contact_no' => ['required', 'string', 'max:20'],
            'affiliation' => ['nullable', 'string', 'max:255'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'password_hash' => Hash::make($validated['password']),
            'birthday' => $validated['birthday'],
            'contact_no' => $validated['contact_no'],
            'affiliation' => $validated['affiliation'],
            'role' => 'user',
        ]);

        // Send Welcome Email
        Mail::to($user->email)->send(new WelcomeUserMail($user));

        // You can log the user in here if desired:
        // auth()->login($user);

        return redirect()->route('register.show')->with('success', 'Registration successful! Please check your email.');
    }
}