<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Enrollment;
use App\Models\Voucher;
use Inertia\Inertia;

class CreatorDashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $certificationIds = Certification::where('created_by_user_id', $userId)->pluck('id');

        $totalStudents = $certificationIds->isEmpty()
            ? 0
            : Enrollment::whereIn('certification_id', $certificationIds)
                ->whereIn('status', ['active', 'completed'])
                ->distinct('user_id')
                ->count('user_id');

        $vouchersUnclaimed = $certificationIds->isEmpty()
            ? 0
            : Voucher::whereIn('certification_id', $certificationIds)
                ->where('is_used', false)
                ->count();

        $certifications = Certification::where('created_by_user_id', $userId)
            ->latest()
            ->get(['id', 'title', 'description', 'status', 'thumbnail', 'accent_color', 'created_at']);

        return Inertia::render('Creator/Dashboard', [
            'metrics' => [
                'total_students' => $totalStudents,
                'vouchers_unclaimed' => $vouchersUnclaimed,
            ],
            'certifications' => $certifications,
        ]);
    }
}
