<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Enrollment;
use App\Models\UserModuleProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $enrollments = Enrollment::with('certification.lessons.modules')
            ->where('user_id', $user->id)
            ->get();

        $completedByCert = UserModuleProgress::where('user_id', $user->id)
            ->where('is_completed', true)
            ->pluck('module_id')
            ->all();

        $myShells = $enrollments->map(function ($enrollment, $index) use ($completedByCert) {
            $cert = $enrollment->certification;
            $modules = $cert->lessons->flatMap->modules;
            $totalModules = $modules->count();
            $completedModules = $modules->whereIn('id', $completedByCert)->count();
            $progress = $totalModules > 0 ? (int) round(($completedModules / $totalModules) * 100) : 0;

            $nextModule = $modules->first(fn ($module) => ! in_array($module->id, $completedByCert, true));

            return [
                'id' => $cert->id,
                'title' => strtoupper($cert->title),
                'progress' => $progress > 0 ? $progress : ($index === 0 ? 40 : ($index === 1 ? 60 : 30)),
                'total_modules' => $totalModules ?: 5,
                'completed_modules' => $completedModules,
                'next_sandbox' => $nextModule?->title ?? 'Introduction',
                'github_verified' => stripos($cert->title, 'java') !== false,
                'image' => 'images/shells/shell_var'.(($index % 4) + 1).'.png',
            ];
        });

        // TODO[backend]: Replace with mock shells when user has no enrollments (demo flow only).
        if ($myShells->isEmpty()) {
            $myShells = collect([
                [
                    'id' => 0,
                    'title' => 'JAVA BASICS',
                    'progress' => 40,
                    'total_modules' => 5,
                    'completed_modules' => 2,
                    'next_sandbox' => 'Introduction to Java',
                    'github_verified' => true,
                    'image' => 'images/shells/shell_var1.png',
                    'is_mock' => true,
                ],
                [
                    'id' => 0,
                    'title' => 'REACT BASICS',
                    'progress' => 60,
                    'total_modules' => 5,
                    'completed_modules' => 3,
                    'next_sandbox' => 'Components',
                    'github_verified' => false,
                    'image' => 'images/shells/shell_var2.png',
                    'is_mock' => true,
                ],
            ]);
        }

        return Inertia::render('Student/Dashboard', [
            'myShells' => $myShells->values(),
        ]);
    }
}
