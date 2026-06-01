<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Support\Mocks\Teacher\TeacherBatchAnalyticsMockData;
use App\Support\Mocks\Teacher\TeacherShellMockData;
use App\Support\Mocks\Teacher\TeacherVoucherMockData;
use Inertia\Inertia;

class TeacherShellController extends Controller
{
    public function index()
    {
        return Inertia::render('Teacher/Shells/Index', [
            'shells' => TeacherShellMockData::purchasedShells(),
            'isMock' => true,
        ]);
    }

    public function show(int $certification)
    {
        $cert = TeacherShellMockData::shellDetail($certification);

        if ($cert === null) {
            abort(404);
        }

        return Inertia::render('Teacher/Shells/Show', [
            'certification' => $cert,
            'batches' => TeacherVoucherMockData::batchesForCert($certification),
            'voucherGroups' => TeacherVoucherMockData::voucherGroups($certification),
            'isMock' => true,
        ]);
    }

    public function batch(int $certification, int $cohort)
    {
        $cert = TeacherShellMockData::shellDetail($certification);

        if ($cert === null) {
            abort(404);
        }

        $analytics = TeacherBatchAnalyticsMockData::payload($certification, $cohort);

        return Inertia::render('Teacher/Shells/Batch', [
            'certification' => $cert,
            'analytics' => $analytics,
            'isMock' => true,
        ]);
    }
}
