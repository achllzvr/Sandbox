<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\WelcomeUserMail;
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

        if ($user && Hash::check($request->password, $user->password)) {
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
            } elseif ($user->role === 'staff') {
                return redirect()->route('staff.dashboard');
            }

            return redirect()->route('user.dashboard');
        }

        return redirect()->back()->withErrors([
            'email' => 'Invalid email or password.'
        ]);
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

        Mail::to($user->email)->send(new WelcomeUserMail($user));

        return redirect()->route('login')->with(
            'success',
            'Registration successful! You can now log in.'
        );
    }
}