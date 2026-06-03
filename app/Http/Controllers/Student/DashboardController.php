<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\UserModuleProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $selectMode = $request->boolean('select');

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

            return $this->formatShell($cert, $index, $progress, $completedModules, $totalModules);
        });

        $defaultShellId = $user->default_certification_id;

        if ($selectMode) {
            $sortedShells = $this->sortShellsWithDefaultFirst($myShells, $defaultShellId);

            return Inertia::render('Student/Dashboard', [
                'myShells' => $sortedShells->values(),
                'selectMode' => true,
                'defaultShellId' => $defaultShellId,
            ]);
        }

        if ($myShells->isEmpty()) {
            return Inertia::render('Student/Dashboard', [
                'myShells' => [],
                'selectMode' => false,
                'defaultShellId' => $defaultShellId,
            ]);
        }

        $defaultShell = $defaultShellId
            ? $myShells->first(fn ($shell) => $shell['id'] === $defaultShellId)
            : null;

        $landingShell = $defaultShell ?? $myShells->first();
        if ($landingShell && ! $request->has('shell')) {
            return redirect()->route('student.shells.show', $landingShell['id']);
        }

        $shellId = (int) $request->input('shell', $landingShell['id']);
        $activeShell = $myShells->firstWhere('id', $shellId) ?? $landingShell;

        return redirect()->route('student.shells.show', $activeShell['id']);
    }

    private function sortShellsWithDefaultFirst($shells, ?int $defaultShellId)
    {
        if (! $defaultShellId) {
            return $shells->values();
        }

        $defaultShell = $shells->first(fn ($shell) => $shell['id'] === $defaultShellId);

        if (! $defaultShell) {
            return $shells->values();
        }

        return collect([$defaultShell])
            ->merge($shells->filter(fn ($shell) => $shell['id'] !== $defaultShellId))
            ->values();
    }

    private function formatShell($cert, int $index, int $progress, int $completedModules, int $totalModules): array
    {
        $githubVerified = stripos($cert->title, 'java') !== false;

        return [
            'id' => $cert->id,
            'title' => strtoupper($cert->title),
            'progress' => $progress,
            'total_modules' => $totalModules ?: 5,
            'completed_modules' => $completedModules,
            'cover_image' => $this->resolveCoverImage($cert),
            'badge_type' => $githubVerified ? 'github' : 'pro',
            'badge_label' => $githubVerified ? 'GITHUB VERIFIED CERTIFICATE' : 'Professional Certificate',
            'github_verified' => $githubVerified,
            'accent_color' => $cert->accent_color,
            'theme' => $this->themeForIndex($cert->id - 1),
        ];
    }

    private function themeForIndex(int $index): string
    {
        return ['pink', 'blue', 'green'][$index % 3];
    }

    private function resolveCoverImage($cert): ?string
    {
        return \App\Support\CertificationCover::url($cert->thumbnail, $cert->id);
    }
}
