<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\InviteUserRequest;
use App\Http\Requests\Admin\VerifyTeacherRequest;
use App\Mail\TeacherAffiliateApprovedMail;
use App\Mail\UserInvitationMail;
use App\Models\User;
use App\Models\UserInvitation;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserManagementController extends Controller
{
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
        } else {
            if ($request->filled('role')) {
                $query->where('role', $request->role);
            }

            if ($request->filled('status')) {
                match ($request->status) {
                    'active' => $query->where('status', 'active')->where('is_active', true),
                    'inactive' => $query->where('status', 'inactive')->where('is_active', true),
                    'suspended' => $query->where('is_active', false),
                    default => null,
                };
            }
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

        $sort = $request->get('sort', 'newest');

        match ($sort) {
            'name_asc' => $query->orderBy('first_name')->orderBy('last_name'),
            'name_desc' => $query->orderByDesc('first_name')->orderByDesc('last_name'),
            'email_asc' => $query->orderBy('email'),
            'email_desc' => $query->orderByDesc('email'),
            'role_asc' => $query->orderBy('role'),
            'role_desc' => $query->orderByDesc('role'),
            'status_asc' => $query->orderBy('status'),
            'status_desc' => $query->orderByDesc('status'),
            'oldest' => $query->oldest(),
            default => $query->latest(),
        };

        $users = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['role', 'search', 'tab', 'approval_status', 'status', 'sort']),
            'pending_approvals_count' => User::where('role', 'teacher')
                ->whereIn('status', ['pending_verification', 'pending'])
                ->count(),
        ]);
    }

    public function show(User $user)
    {
        $user->load('verifier:id,first_name,last_name');

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    public function suspend(User $user, AuditLogService $auditLog)
    {
        if ($user->role === 'admin') {
            return redirect()->back()->with('error', 'Admin accounts cannot be suspended.');
        }

        $user->update([
            'status' => 'inactive',
            'is_active' => false,
        ]);

        $auditLog->log('user_suspended', auth()->id(), [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);

        return redirect()->back()->with('success', "{$user->first_name} {$user->last_name} has been suspended.");
    }

    public function archive(User $user, AuditLogService $auditLog)
    {
        if ($user->role === 'admin') {
            return redirect()->back()->with('error', 'Admin accounts cannot be archived.');
        }

        $user->update([
            'status' => 'inactive',
            'is_active' => false,
        ]);

        $auditLog->log('user_archived', auth()->id(), [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);

        return redirect()->back()->with('success', "{$user->first_name} {$user->last_name} has been archived.");
    }

    public function invite(InviteUserRequest $request)
    {
        if (User::where('email', $request->email)->exists()) {
            return redirect()->back()->withErrors(['email' => 'User already exists.']);
        }

        $token = Str::random(60);
        $invitation = UserInvitation::updateOrCreate(
            ['email' => $request->email],
            [
                'role' => $request->role,
                'token' => $token,
            ]
        );

        Mail::to($invitation->email)->send(new UserInvitationMail($invitation));

        return redirect()->route('admin.users.index')
            ->with('success', 'Invitation sent successfully!');
    }

    public function inviteAdmin(Request $request, AuditLogService $auditLog)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'unique:users,email'],
        ]);

        if (User::where('email', $validated['email'])->exists()) {
            return redirect()->back()->withErrors(['email' => 'User already exists.']);
        }

        $token = Str::random(60);
        $invitation = UserInvitation::updateOrCreate(
            ['email' => $validated['email']],
            [
                'role' => 'admin',
                'token' => $token,
            ]
        );

        Mail::to($invitation->email)->send(new UserInvitationMail($invitation));

        $auditLog->log('admin_invited', auth()->id(), [
            'email' => $validated['email'],
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Admin invitation sent successfully!');
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
