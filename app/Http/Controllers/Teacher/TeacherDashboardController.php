<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Support\Mocks\Teacher\TeacherDashboardMockData;
use Inertia\Inertia;

class TeacherDashboardController extends Controller
{
    public function index()
    {
        $payload = TeacherDashboardMockData::payload();

        return Inertia::render('Teacher/Dashboard', [
            'metrics' => $payload['metrics'],
            'claimLogs' => $payload['claim_logs'],
            'isMock' => $payload['is_mock'],
        ]);
    }
}
