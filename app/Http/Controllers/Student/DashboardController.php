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

        if ($myShells->isEmpty()) {
            $myShells = collect([
                $this->mockShell('JAVA BASICS', 40, 1, true, null, 0),
                $this->mockShell('REACT BASICS', 60, 2, false, null, 1),
                $this->mockShell('LARAVEL BASICS', 30, 3, false, null, 2),
                $this->mockFullDemoShell(),
            ]);
        }

        $defaultShellId = $user->default_certification_id;
        $defaultShell = $defaultShellId
            ? $myShells->first(fn ($shell) => $shell['id'] === $defaultShellId && ! ($shell['is_mock'] ?? false))
            : null;

        if ($selectMode) {
            $sortedShells = $this->sortShellsWithDefaultFirst($myShells, $defaultShellId);

            return Inertia::render('Student/Dashboard', [
                'myShells' => $sortedShells->values(),
                'selectMode' => true,
                'defaultShellId' => $defaultShellId,
            ]);
        }

        $landingShell = $defaultShell ?? $myShells->first(fn ($shell) => ! ($shell['is_mock'] ?? false));
        if ($landingShell && ! $request->has('shell')) {
            return redirect()->route('student.shells.show', $landingShell['id']);
        }

        $shellId = (int) $request->input('shell', $myShells->first()['id'] ?? 1);
        $activeShell = $myShells->firstWhere('id', $shellId) ?? $myShells->first();

        if ($activeShell && ! ($activeShell['is_mock'] ?? false)) {
            return redirect()->route('student.shells.show', $activeShell['id']);
        }

        $mockCert = strtoupper($activeShell['title'] ?? '') === 'FULL DEMO'
            ? $this->mockFullDemoCertification()
            : $this->mockCertification($activeShell['title'] ?? 'JAVA BASICS');
        $completedModules = $activeShell['completed_modules'] ?? 0;
        $progress = $this->mockProgress($mockCert, $completedModules);

        return Inertia::render('Student/Dashboard', [
            'myShells' => $myShells->values(),
            'selectMode' => false,
            'certification' => $mockCert,
            'progress' => $progress,
            'shellMeta' => $activeShell,
            'defaultShellId' => $defaultShellId,
        ]);
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

    private function mockProgress(array $certification, int $completedCount): array
    {
        $allModules = collect($certification['lessons'])->flatMap(fn ($lesson) => $lesson['modules']);
        $total = $allModules->count();
        $completed = min($completedCount, $total);
        $completedIds = $allModules->take($completed)->pluck('id')->all();

        return [
            'completed_modules' => $completed,
            'total_modules' => $total,
            'completed_module_ids' => $completedIds,
            'percentage' => $total > 0 ? (int) round(($completed / $total) * 100) : 0,
        ];
    }

    private function mockFullDemoShell(): array
    {
        return [
            'id' => 99,
            'title' => 'FULL DEMO',
            'progress' => 20,
            'total_modules' => 10,
            'completed_modules' => 2,
            'cover_image' => null,
            'badge_type' => 'pro',
            'badge_label' => 'Professional Certificate',
            'github_verified' => false,
            'is_mock' => true,
            'theme' => 'blue',
        ];
    }

    private function mockFullDemoCertification(): array
    {
        return [
            'id' => 99,
            'title' => 'FULL DEMO',
            'lessons' => [
                [
                    'id' => 91,
                    'title' => 'UNIT 1 — FOUNDATIONS',
                    'modules' => [
                        ['id' => 901, 'title' => 'Welcome to the Sandbox', 'contents' => [['content_type' => 'document']], 'questions' => []],
                        ['id' => 902, 'title' => 'Your First Shell', 'contents' => [['content_type' => 'video']], 'questions' => []],
                        ['id' => 903, 'title' => 'Exploring Sandboxes', 'contents' => [], 'questions' => []],
                    ],
                ],
                [
                    'id' => 92,
                    'title' => 'UNIT 2 — CORE SKILLS',
                    'modules' => [
                        ['id' => 904, 'title' => 'Building Blocks', 'contents' => [['content_type' => 'presentation']], 'questions' => []],
                        ['id' => 905, 'title' => 'Practice Drill', 'contents' => [], 'questions' => [['id' => 1], ['id' => 2]]],
                        ['id' => 906, 'title' => 'Skill Check Quiz', 'contents' => [], 'questions' => [['id' => 3], ['id' => 4], ['id' => 5]]],
                    ],
                ],
                [
                    'id' => 93,
                    'title' => 'UNIT 3 — ADVANCED TOPICS',
                    'modules' => [
                        ['id' => 907, 'title' => 'Deep Dive', 'contents' => [['content_type' => 'video']], 'questions' => []],
                        ['id' => 908, 'title' => 'Applied Concepts', 'contents' => [['content_type' => 'document']], 'questions' => []],
                        ['id' => 909, 'title' => 'Advanced Quiz', 'contents' => [], 'questions' => [['id' => 6], ['id' => 7]]],
                    ],
                ],
                [
                    'id' => 94,
                    'title' => 'UNIT 4 — CHECKPOINT',
                    'modules' => [
                        ['id' => 910, 'title' => 'Unit Review Quiz', 'contents' => [], 'questions' => [['id' => 8], ['id' => 9], ['id' => 10]]],
                    ],
                ],
            ],
            'examQuestions' => [
                ['id' => 1, 'question_text' => 'Sample final exam question?', 'answers' => [
                    ['id' => 1, 'answer_text' => 'Correct answer', 'is_correct' => true],
                    ['id' => 2, 'answer_text' => 'Wrong answer', 'is_correct' => false],
                ]],
            ],
        ];
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
            'theme' => $this->themeForIndex($index),
        ];
    }

    private function mockShell(string $title, int $progress, int $id, bool $github, ?string $cover, int $index): array
    {
        return [
            'id' => $id,
            'title' => $title,
            'progress' => $progress,
            'total_modules' => 5,
            'completed_modules' => (int) round($progress / 20),
            'cover_image' => $cover,
            'badge_type' => $github ? 'github' : 'pro',
            'badge_label' => $github ? 'GITHUB VERIFIED CERTIFICATE' : 'Professional Certificate',
            'github_verified' => $github,
            'is_mock' => true,
            'theme' => $this->themeForIndex($index),
        ];
    }

    private function themeForIndex(int $index): string
    {
        return ['pink', 'blue', 'green'][$index % 3];
    }

    private function mockCertification(string $title): array
    {
        $lessons = match (strtoupper($title)) {
            'REACT BASICS' => [
                [
                    'id' => 21,
                    'title' => 'REACT BASICS',
                    'modules' => [
                        ['id' => 201, 'title' => 'Introduction to React', 'contents' => [], 'questions' => []],
                        ['id' => 202, 'title' => 'Components & Props', 'contents' => [], 'questions' => []],
                    ],
                ],
                [
                    'id' => 22,
                    'title' => 'REACT STATE',
                    'modules' => [
                        ['id' => 203, 'title' => 'State & Effects', 'contents' => [], 'questions' => []],
                        ['id' => 204, 'title' => 'React Router', 'contents' => [], 'questions' => []],
                    ],
                ],
                [
                    'id' => 23,
                    'title' => 'REACT QUIZ',
                    'modules' => [
                        ['id' => 205, 'title' => 'React Quiz', 'contents' => [], 'questions' => [['id' => 1]]],
                    ],
                ],
            ],
            'LARAVEL BASICS' => [
                [
                    'id' => 31,
                    'title' => 'LARAVEL BASICS',
                    'modules' => [
                        ['id' => 301, 'title' => 'Introduction to Laravel', 'contents' => [], 'questions' => []],
                        ['id' => 302, 'title' => 'Routing & Controllers', 'contents' => [], 'questions' => []],
                    ],
                ],
                [
                    'id' => 32,
                    'title' => 'LARAVEL DATA',
                    'modules' => [
                        ['id' => 303, 'title' => 'Eloquent ORM', 'contents' => [], 'questions' => []],
                        ['id' => 304, 'title' => 'Blade Templates', 'contents' => [], 'questions' => []],
                    ],
                ],
                [
                    'id' => 33,
                    'title' => 'LARAVEL QUIZ',
                    'modules' => [
                        ['id' => 305, 'title' => 'Laravel Quiz', 'contents' => [], 'questions' => [['id' => 1]]],
                    ],
                ],
            ],
            default => [
                [
                    'id' => 11,
                    'title' => 'JAVA BASICS',
                    'modules' => [
                        ['id' => 101, 'title' => 'Introduction to Java', 'contents' => [], 'questions' => []],
                        ['id' => 102, 'title' => 'Java Variables', 'contents' => [], 'questions' => []],
                    ],
                ],
                [
                    'id' => 12,
                    'title' => 'JAVA MATH',
                    'modules' => [
                        ['id' => 103, 'title' => 'Java Math', 'contents' => [], 'questions' => []],
                        ['id' => 104, 'title' => 'Java Loops', 'contents' => [], 'questions' => []],
                    ],
                ],
                [
                    'id' => 13,
                    'title' => 'JAVA QUIZ',
                    'modules' => [
                        ['id' => 105, 'title' => 'Java Quiz', 'contents' => [], 'questions' => [['id' => 1]]],
                    ],
                ],
            ],
        };

        return [
            'id' => 0,
            'title' => strtoupper($title),
            'lessons' => $lessons,
            'examQuestions' => [],
        ];
    }

    private function resolveCoverImage($cert): ?string
    {
        if (! empty($cert->thumbnail)) {
            return asset('storage/'.$cert->thumbnail);
        }

        return null;
    }
}
