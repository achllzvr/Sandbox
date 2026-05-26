<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\EnrollmentRequest;
use App\Models\Lesson;
use App\Models\User;
use App\Models\Voucher;
use App\Mail\StaffAccountCreatedMail;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function dashboard()
    {
        $totalUsers = User::where('role', 'user')->count();

        $totalStaff = User::where('role', 'content_creator')->count();

        $totalCertifications = Certification::count();

        $activeCertifications = Certification::where('is_active', true)->count();

        $inactiveCertifications = Certification::where('is_active', false)->count();

        $totalEnrollments = EnrollmentRequest::count();

        $pendingEnrollments = EnrollmentRequest::where('status', 'pending')->count();

        $approvedEnrollments = EnrollmentRequest::where('status', 'approved')->count();

        $recentCertifications = Certification::latest()->take(5)->get();

        $recentEnrollmentRequests = EnrollmentRequest::with([
            'user',
            'certification'
        ])->latest('requested_at')->take(5)->get();

        return view('admin.dashboard', compact(
            'totalUsers',
            'totalStaff',
            'totalCertifications',
            'activeCertifications',
            'inactiveCertifications',
            'totalEnrollments',
            'pendingEnrollments',
            'approvedEnrollments',
            'recentCertifications',
            'recentEnrollmentRequests'
        ));
    }

    public function showCreateStaff()
    {
        $content_creatorUsers = User::where('role', 'content_creator')
            ->latest()
            ->paginate(12);

        return view('admin.create-content_creator', compact('content_creatorUsers'));
    }

    public function createStaff(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'birthday' => 'required|date',
            'contact_no' => 'required|string|max:20',
        ]);

        $password = $request->password;

        $content_creator = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($password),
            'birthday' => $request->birthday,
            'contact_no' => $request->contact_no,
            'role' => 'content_creator',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        Mail::to($content_creator->email)->queue(
            new StaffAccountCreatedMail($content_creator, $password)
        );

        return redirect()
            ->route('admin.content_creator.create')
            ->with('success', 'Content Creator account created successfully.');
    }

    public function editStaff(User $content_creator)
    {
        if ($content_creator->role !== 'content_creator') {
            abort(404);
        }

        return view('admin.edit-content_creator', compact('content_creator'));
    }

    public function updateStaff(Request $request, User $content_creator)
    {
        if ($content_creator->role !== 'content_creator') {
            abort(404);
        }

        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|string|email|max:255|unique:users,email,' . $content_creator->id,
            'birthday' => 'required|date',
            'contact_no' => 'required|string|max:20',
            'is_active' => 'required|boolean',
        ]);

        $content_creator->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'birthday' => $request->birthday,
            'contact_no' => $request->contact_no,
            'is_active' => $request->is_active,
        ]);

        return redirect()
            ->route('admin.content_creator.create')
            ->with('success', 'Content Creator details updated successfully.');
    }

    public function toggleStaffStatus(User $content_creator)
    {
        if ($content_creator->role !== 'content_creator') {
            abort(404);
        }

        $content_creator->update([
            'is_active' => !$content_creator->is_active
        ]);

        return redirect()
            ->back()
            ->with('success', 'Content Creator account status updated successfully.');
    }

    public function resetStaffPassword(User $content_creator)
    {
        if ($content_creator->role !== 'content_creator') {
            abort(404);
        }

        $password = Str::random(10);

        $content_creator->update([
            'password' => Hash::make($password)
        ]);

        Mail::to($content_creator->email)->queue(
            new StaffAccountCreatedMail($content_creator, $password)
        );

        return redirect()
            ->back()
            ->with('success', 'Password reset successfully and emailed to the content_creator user.');
    }

    public function showCertifications()
    {
        $certifications = Certification::latest()->get();

        return view('admin.create-certification', compact('certifications'));
    }

    public function createCertification(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'pass_threshold' => 'required|integer|min:1|max:100',
            'is_active' => 'required|in:0,1',
        ]);

        Certification::create([
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'pass_threshold' => $request->pass_threshold,
            'is_active' => $request->is_active == '1',
            'created_by_admin_id' => session('user_id'),
        ]);

        return redirect()
            ->route('admin.certifications.create')
            ->with('success', 'Certification created successfully.');
    }

    public function editCertification(Certification $certification)
    {
        return view('admin.edit-certification', compact('certification'));
    }

    public function updateCertification(Request $request, Certification $certification)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'pass_threshold' => 'required|integer|min:1|max:100',
            'is_active' => 'required|in:0,1',
        ]);

        $certification->update([
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'pass_threshold' => $request->pass_threshold,
            'is_active' => $request->is_active == '1',
        ]);

        return redirect()
            ->route('admin.certifications.create')
            ->with('success', 'Certification updated successfully.');
    }

    public function deleteCertification(Certification $certification)
    {
        $certification->delete();

        return redirect()
            ->route('admin.certifications.create')
            ->with('success', 'Certification deleted successfully.');
    }

    public function showCreateLesson()
    {
        $certifications = Certification::active()
            ->latest()
            ->get();

        $lessons = Lesson::with('certification')
            ->latest()
            ->get();

        return view('admin.create-lesson', compact(
            'certifications',
            'lessons'
        ));
    }

    public function createLesson(Request $request)
    {
        $request->validate([
            'certification_id' => 'required|exists:certifications,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Lesson::create([
            'certification_id' => $request->certification_id,
            'title' => $request->title,
            'description' => $request->description,
            'created_by_content_creator_id' => session('user_id'),
        ]);

        return redirect()
            ->back()
            ->with('success', 'Lesson created successfully.');
    }

    public function showVouchers()
    {
        $vouchers = Voucher::latest()->get();

        return view('admin.vouchers', compact('vouchers'));
    }

    public function createVoucher(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:50|unique:vouchers,code',
            'discount_type' => 'required|in:percent,fixed',
            'discount_value' => 'required|numeric|min:0.01',
            'max_uses' => 'required|integer|min:1',
            'expires_at' => 'nullable|date|after:today',
        ]);

        Voucher::create([
            'code' => strtoupper($request->code),
            'discount_type' => $request->discount_type,
            'discount_value' => $request->discount_value,
            'max_uses' => $request->max_uses,
            'uses_count' => 0,
            'expires_at' => $request->expires_at,
            'created_by_admin_id' => session('user_id'),
        ]);

        return redirect()
            ->back()
            ->with('success', 'Voucher created successfully.');
    }

    public function enrollments()
    {
        $enrollments = EnrollmentRequest::with([
            'user',
            'certification',
            'reviewer'
        ])
        ->latest('requested_at')
        ->get();

        return view('admin.enrollments', compact('enrollments'));
    }

    public function approveEnrollment(EnrollmentRequest $enrollment)
    {
        $enrollment->update([
            'status' => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => session('user_id'),
        ]);

        return redirect()
            ->back()
            ->with('success', 'Enrollment request approved successfully.');
    }

    public function rejectEnrollment(EnrollmentRequest $enrollment)
    {
        $enrollment->update([
            'status' => 'rejected',
            'reviewed_at' => now(),
            'reviewed_by' => session('user_id'),
        ]);

        return redirect()
            ->back()
            ->with('success', 'Enrollment request rejected.');
    }
}