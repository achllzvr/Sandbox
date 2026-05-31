<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => false,
            'status' => session('status'),
        ]);
    }

    // TODO[backend]: Persist profile name/email to users table (split name into first_name/last_name/full_name).
    public function update(Request $request)
    {
        // Add actual profile update logic here
        return Redirect::route('profile.edit');
    }

    // TODO[backend]: Implement account deletion with password confirmation (non-admin users only in UI).
    public function destroy(Request $request)
    {
        // Add actual profile delete logic here
        return Redirect::to('/');
    }
}

