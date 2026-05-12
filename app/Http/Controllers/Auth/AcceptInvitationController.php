<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AcceptInviteRequest;
use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AcceptInvitationController extends Controller
{
    public function show($token)
    {
        $invitation = UserInvitation::where('token', $token)->firstOrFail();

        return Inertia::render('Auth/AcceptInvite', [
            'token' => $token,
            'email' => $invitation->email,
        ]);
    }

    public function store(AcceptInviteRequest $request)
    {
        $invitation = UserInvitation::where('token', $request->token)->firstOrFail();

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $invitation->email,
            'password' => Hash::make($request->password),
            'role' => $invitation->role,
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $invitation->delete();

        Auth::login($user);

        // Redirect based on role
        if ($user->role === 'teacher') {
            return redirect()->route('teacher.dashboard');
        } elseif ($user->role === 'staff') {
            return redirect()->route('creator.dashboard'); // Adjust based on your actual route
        }

        return redirect()->route('dashboard');
    }
}
