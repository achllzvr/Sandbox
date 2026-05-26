<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Http\Requests\Admin\InviteUserRequest;
use App\Http\Requests\Admin\VerifyTeacherRequest;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users'   => $users,
            'filters' => $request->only(['role', 'search']),
        ]);
    }

    public function invite(InviteUserRequest $request)
    {
        // Check if user already exists
        if (\App\Models\User::where('email', $request->email)->exists()) {
            return redirect()->back()->withErrors(['email' => 'User already exists.']);
        }

        // Create or update invitation
        $token = \Illuminate\Support\Str::random(60);
        $invitation = \App\Models\UserInvitation::updateOrCreate(
            ['email' => $request->email],
            [
                'role' => $request->role,
                'token' => $token,
            ]
        );

        // Send email
        \Illuminate\Support\Facades\Mail::to($invitation->email)
            ->send(new \App\Mail\UserInvitationMail($invitation));

        return redirect()->route('admin.users.index')
            ->with('success', 'Invitation sent successfully!');
    }

    public function verifyTeacher(VerifyTeacherRequest $request, User $user)
    {
        if ($user->role !== 'teacher') {
            abort(404);
        }

        if ($request->action === 'approve') {
            $user->update([
                'status' => 'active',
                'verified_by' => auth()->id(),
                'verified_at' => now(),
            ]);
            $message = "Teacher {$user->first_name} has been approved.";
        } else {
            $user->update([
                'status' => 'declined',
                'verified_by' => auth()->id(),
                'verified_at' => now(),
            ]);
            $message = "Teacher {$user->first_name} has been declined.";
        }

        return redirect()->back()->with('success', $message);
    }
}
