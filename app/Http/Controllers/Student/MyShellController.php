<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Enrollment;
use Inertia\Inertia;
use Illuminate\Http\Request;

class MyShellController extends Controller
{
    public function show(Request $request, $id)
    {
        $user = $request->user();

        // Verify the user is enrolled in this certification
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('certification_id', $id)
            ->first();

        if (! $enrollment) {
            abort(403, 'You are not enrolled in this Shell.');
        }

        // Load the certification with its nested lessons and modules
        $certification = Certification::with(['lessons.modules', 'creator'])
            ->findOrFail($id);

        // Get the IDs of all modules the user has completed
        $completedModuleIds = $user->completedModules()->pluck('modules.id')->toArray();

        // Calculate total modules
        $totalModules = $certification->lessons->sum(function ($lesson) {
            return $lesson->modules->count();
        });

        $progress = [
            'completed_modules' => count($completedModuleIds),
            'total_modules' => $totalModules,
            'completed_module_ids' => $completedModuleIds,
            'percentage' => $totalModules > 0 ? (count($completedModuleIds) / $totalModules) * 100 : 0,
        ];

        return Inertia::render('Student/Shells/Show', [
            'certification' => $certification,
            'progress' => $progress,
        ]);
    }

    public function completeModule(Request $request, \App\Models\Module $module)
    {
        $user = $request->user();

        \App\Models\UserModuleProgress::updateOrCreate(
            ['user_id' => $user->id, 'module_id' => $module->id],
            ['is_completed' => 1, 'completed_at' => now()]
        );

        return redirect()->back()->with('success', 'Module marked as completed!');
    }
}
