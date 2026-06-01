<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\InviteUserRequest;
use App\Http\Requests\Admin\VerifyTeacherRequest;
use App\Mail\TeacherAffiliateApprovedMail;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    // TODO[backend]: Add suspend(), archive(), show() endpoints for user management card actions.

    public function index(Request $request)
    {
        $query = User::query();
        $isApprovalsTab = $request->get('tab') === 'approvals';

        if ($isApprovalsTab) {
            $query->where('role', 'teacher');

            if ($request->filled('approval_status')) {
                match ($request->approval_status) {
                    'pending' => $query->whereIn('status', ['pending_verification', 'pending']),
                    'approved' => $query->where('status', 'active'),
                    'declined' => $query->whereIn('status', ['declined', 'inactive']),
                    default => null,
                };
            }
        } elseif ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('affiliation', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['role', 'search', 'tab', 'approval_status']),
            'pending_approvals_count' => User::where('role', 'teacher')
                ->whereIn('status', ['pending_verification', 'pending'])
                ->count(),
        ]);
    }

    public function invite(InviteUserRequest $request)
    {
        // TODO[backend]: Add admin role invite path — InviteUserRequest excludes admin; CreateUserFlow fakes success for admin.

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

    public function verifyTeacher(VerifyTeacherRequest $request, User $user, AuditLogService $auditLog)
    {
        if ($user->role !== 'teacher') {
            abort(404);
        }

        $isPending = in_array($user->status, ['pending_verification', 'pending'], true);

        if ($request->action === 'approve') {
            if (! $isPending && $user->status === 'active') {
                return redirect()->back()->with('error', 'This affiliate is already approved.');
            }

            $user->update([
                'status' => 'active',
                'is_active' => true,
                'verified_by' => auth()->id(),
                'verified_at' => now(),
            ]);

            Mail::to($user->email)->send(new TeacherAffiliateApprovedMail($user));

            $auditLog->log('teacher_approved', auth()->id(), [
                'teacher_id' => $user->id,
                'teacher_email' => $user->email,
                'affiliation' => $user->affiliation,
            ]);

            $message = "{$user->first_name} {$user->last_name} has been approved and activated.";
        } else {
            if (! $isPending && $user->status === 'declined') {
                return redirect()->back()->with('error', 'This affiliate request was already declined.');
            }

            $user->update([
                'status' => 'declined',
                'is_active' => false,
                'verified_by' => auth()->id(),
                'verified_at' => now(),
            ]);

            $auditLog->log('teacher_declined', auth()->id(), [
                'teacher_id' => $user->id,
                'teacher_email' => $user->email,
                'affiliation' => $user->affiliation,
            ]);

            $message = "{$user->first_name} {$user->last_name}'s affiliate request has been declined.";
        }

        return redirect()->back()->with('success', $message);
    }
}
