<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateCertificationStatusRequest;
use App\Models\Certification;
use Inertia\Inertia;

class CertificationApprovalController extends Controller
{
    public function index()
    {
        $certifications = Certification::query()
            ->with([
                'creator:id,first_name,last_name',
                'approver:id,first_name,last_name',
                'lessons:id,certification_id',
                'lessons.modules:id,lesson_id',
                'lessons.modules.contents:id,module_id',
                'lessons.modules.questions:id,module_id',
            ])
            ->latest()
            ->get()
            ->map(function (Certification $certification) {
                $modulesCount = $certification->lessons->sum(fn ($lesson) => $lesson->modules->count());
                $contentsCount = $certification->lessons->sum(
                    fn ($lesson) => $lesson->modules->sum(fn ($module) => $module->contents->count())
                );
                $questionsCount = $certification->lessons->sum(
                    fn ($lesson) => $lesson->modules->sum(fn ($module) => $module->questions->count())
                );

                return [
                    'id' => $certification->id,
                    'title' => $certification->title,
                    'description' => $certification->description,
                    'status' => $certification->status,
                    'created_at' => $certification->created_at,
                    'decline_reason' => $certification->decline_reason,
                    'approved_at' => $certification->approved_at,
                    'creator' => $certification->creator,
                    'approver' => $certification->approver,
                    'lessons_count' => $certification->lessons->count(),
                    'modules_count' => $modulesCount,
                    'contents_count' => $contentsCount,
                    'questions_count' => $questionsCount,
                ];
            });

        return Inertia::render('Admin/Certifications/Index', [
            'certifications' => $certifications,
        ]);
    }

    public function update(UpdateCertificationStatusRequest $request, Certification $certification)
    {
        $validated = $request->validated();

        $certification->update([
            'status' => $validated['status'],
            'decline_reason' => $validated['status'] === 'declined'
                ? $validated['decline_reason']
                : null,
            'approved_by' => $validated['status'] === 'published' ? auth()->id() : null,
            'approved_at' => $validated['status'] === 'published' ? now() : null,
        ]);

        return redirect()->back()
            ->with('success', 'Certification status updated.');
    }
}
