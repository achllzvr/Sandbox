<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Enrollment;
use App\Models\Module;
use App\Models\User;
use App\Models\UserModuleProgress;
use App\Models\Voucher;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $certificationIds = Certification::where('created_by_user_id', $userId)->pluck('id');

        $certifications = Certification::where('created_by_user_id', $userId)
            ->published()
            ->orderBy('title')
            ->get(['id', 'title']);

        $selectedCertId = (int) request('certification_id', $certifications->first()?->id ?? 0);

        if ($selectedCertId && ! $certifications->pluck('id')->contains($selectedCertId)) {
            $selectedCertId = $certifications->first()?->id ?? 0;
        }

        $students = collect();

        if ($selectedCertId && $certificationIds->contains($selectedCertId)) {
            $enrollmentUserIds = Enrollment::where('certification_id', $selectedCertId)
                ->whereIn('status', ['active', 'completed'])
                ->pluck('user_id');

            $moduleIds = Module::whereHas('lesson', fn ($q) => $q->where('certification_id', $selectedCertId))
                ->pluck('id');

            $totalModules = $moduleIds->count();

            $students = User::whereIn('id', $enrollmentUserIds)
                ->get(['id', 'first_name', 'last_name', 'email'])
                ->map(function (User $user) use ($moduleIds, $totalModules) {
                    $completed = $totalModules > 0
                        ? UserModuleProgress::where('user_id', $user->id)
                            ->whereIn('module_id', $moduleIds)
                            ->where('is_completed', true)
                            ->count()
                        : 0;

                    $progressPct = $totalModules > 0
                        ? (int) round(($completed / $totalModules) * 100)
                        : 0;

                    return [
                        'id' => $user->id,
                        'name' => trim("{$user->first_name} {$user->last_name}"),
                        'email' => $user->email,
                        'modules_completed' => $completed,
                        'modules_total' => $totalModules,
                        'progress_pct' => $progressPct,
                    ];
                })
                ->sortByDesc('progress_pct')
                ->values();
        }

        return Inertia::render('Creator/Auditor/Index', [
            'certifications' => $certifications,
            'selectedCertificationId' => $selectedCertId ?: null,
            'students' => $students,
        ]);
    }
}
