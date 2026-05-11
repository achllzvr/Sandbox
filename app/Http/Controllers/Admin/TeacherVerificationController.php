<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherVerificationController extends Controller
{
    public function index()
    {
        $teachers = User::where('role', 'teacher')
            ->whereIn('status', ['pending_verification', 'active', 'inactive'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Teachers/Index', [
            'teachers' => $teachers,
        ]);
    }

    public function approve(User $user)
    {
        if ($user->role !== 'teacher') {
            abort(404);
        }

        $user->update([
            'status'      => 'active',
            'verified_by' => auth()->id(),
            'verified_at' => now(),
        ]);

        return redirect()->back()
            ->with('success', "{$user->first_name} {$user->last_name} has been approved.");
    }

    public function decline(User $user)
    {
        if ($user->role !== 'teacher') {
            abort(404);
        }

        $user->update([
            'status'      => 'inactive',
            'verified_by' => auth()->id(),
            'verified_at' => now(),
        ]);

        return redirect()->back()
            ->with('success', "{$user->first_name} {$user->last_name} has been rejected/made inactive.");
    }
}
