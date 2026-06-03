<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Cohort;
use App\Models\Voucher;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TeacherShellController extends Controller
{
    public function index()
    {
        $teacherId = auth()->id();

        $certIds = Voucher::where('teacher_id', $teacherId)->pluck('certification_id')->unique();
        $shells = Certification::whereIn('id', $certIds)->get()->map(fn ($cert) => [
            'id' => $cert->id,
            'title' => $cert->title,
            'price' => $cert->price,
            'thumbnail' => $cert->thumbnail,
        ]);

        $purchaseHistory = DB::table('payments')
            ->where('user_id', $teacherId)
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        return Inertia::render('Teacher/Shells/Index', [
            'shells' => $shells,
            'purchaseHistory' => $purchaseHistory,
            'isMock' => false,
        ]);
    }

    public function show(int $certification)
    {
        $teacherId = auth()->id();
        $cert = Certification::findOrFail($certification);

        $owns = Voucher::where('teacher_id', $teacherId)->where('certification_id', $certification)->exists();
        if (! $owns) {
            abort(403);
        }

        $batches = Cohort::where('teacher_id', $teacherId)
            ->where('certification_id', $certification)
            ->withCount('students')
            ->get();

        $voucherGroups = Voucher::where('teacher_id', $teacherId)
            ->where('certification_id', $certification)
            ->select('cohort_id', DB::raw('COUNT(*) as total'), DB::raw('SUM(is_used) as claimed'))
            ->groupBy('cohort_id')
            ->get();

        return Inertia::render('Teacher/Shells/Show', [
            'certification' => $cert,
            'batches' => $batches,
            'voucherGroups' => $voucherGroups,
            'purchaseHistory' => [],
            'isMock' => false,
        ]);
    }

    public function batch(int $certification, int $cohort)
    {
        $teacherId = auth()->id();
        $cert = Certification::findOrFail($certification);
        $batch = Cohort::where('id', $cohort)->where('teacher_id', $teacherId)->firstOrFail();

        $studentIds = DB::table('cohort_students')->where('cohort_id', $cohort)->pluck('user_id');
        $completed = DB::table('user_module_progress')
            ->whereIn('user_id', $studentIds)
            ->where('is_completed', true)
            ->count();

        return Inertia::render('Teacher/Shells/Batch', [
            'certification' => $cert,
            'analytics' => [
                'cohort_name' => $batch->cohort_name,
                'students' => $studentIds->count(),
                'completed_modules' => $completed,
            ],
            'isMock' => false,
        ]);
    }
}
