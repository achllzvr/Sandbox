<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\User;
use App\Models\Voucher;
use App\Mail\StaffAccountCreatedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AdminController extends Controller
{
    public function dashboard()
    {
        $totalUsers = User::where('role', 'user')->count();
        $totalStaff = User::where('role', 'staff')->count();
        $totalCertifications = Certification::count();
        $activeCertifications = Certification::where('is_active', true)->count();

        return view('admin.dashboard', compact(
            'totalUsers',
            'totalStaff',
            'totalCertifications',
            'activeCertifications'
        ));
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
            'affiliation' => 'nullable|string|max:255',
        ]);

        $staff = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'birthday' => $request->birthday,
            'contact_no' => $request->contact_no,
            'affiliation' => $request->affiliation,
            'role' => 'staff',
        ]);

        Mail::to($staff->email)->send(
            new StaffAccountCreatedMail($staff, $request->password)
        );

        return redirect()->back()->with(
            'success',
            'Staff account created successfully.'
        );
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

        return redirect()->back()->with('success', 'Certification created successfully.');
    }

    public function showCreateLesson()
    {
        $certifications = Certification::where('is_active', 1)->latest()->get();

        $lessons = Lesson::with('certification')->latest()->get();

        return view('admin.create-lesson', compact('certifications', 'lessons'));
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
            'created_by_staff_id' => session('user_id'),
        ]);

        return redirect()->back()->with('success', 'Lesson created successfully.');
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

        return redirect()->back()->with('success', 'Voucher created successfully.');
    }

    public function enrollments()
    {
        $enrollments = Enrollment::with(['user', 'certification'])
            ->latest()
            ->get();

        return view('admin.enrollments', compact('enrollments'));
    }
}
