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
                'learningMaterials'
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
                    'category' => $certification->category,
                    'difficulty' => $certification->difficulty,
                    'status' => $certification->status,
                    'created_at' => $certification->created_at,
                    'submitted_at' => $certification->submitted_at,
                    'decline_reason' => $certification->decline_reason,
                    'remarks' => $certification->remarks,
                    'approved_at' => $certification->approved_at,
                    'creator' => $certification->creator,
                    'approver' => $certification->approver,
                    'learning_materials' => $certification->learningMaterials,
                    'learning_materials_count' => $certification->learningMaterials->count(),
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

    public function show(Certification $certification)
    {
        $certification->load([
            'creator:id,first_name,last_name',
            'learningMaterials',
            'lessons' => fn ($q) => $q->orderBy('id'),
            'lessons.modules' => fn ($q) => $q->orderBy('sequence'),
            'lessons.modules.contents',
            'lessons.modules.questions.answers',
        ]);

        $modulesCount = $certification->lessons->sum(fn ($l) => $l->modules->count());
        $contentsCount = $certification->lessons->sum(
            fn ($l) => $l->modules->sum(fn ($m) => $m->contents->count())
        );
        $questionsCount = $certification->lessons->sum(
            fn ($l) => $l->modules->sum(fn ($m) => $m->questions->count())
        );

        return Inertia::render('Admin/Certifications/Show', [
            'certification' => array_merge($certification->toArray(), [
                'learning_materials_count' => $certification->learningMaterials->count(),
                'lessons_count' => $certification->lessons->count(),
                'modules_count' => $modulesCount,
                'contents_count' => $contentsCount,
                'questions_count' => $questionsCount,
            ])
        ]);
    }

    public function update(UpdateCertificationStatusRequest $request, Certification $certification)
    {
        $validated = $request->validated();

        $certification->update([
            'status' => $validated['status'],
            'decline_reason' => $validated['status'] === 'denied' ? ($validated['decline_reason'] ?? null) : null,
            'remarks' => null, // clear remarks if approving/denying directly
            'approved_by' => in_array($validated['status'], ['approved', 'published']) ? auth()->id() : null,
            'approved_at' => in_array($validated['status'], ['approved', 'published']) ? now() : null,
        ]);

        return redirect()->back()
            ->with('success', 'Certification status updated.');
    }

    public function requestRevision(\Illuminate\Http\Request $request, Certification $certification)
    {
        $validated = $request->validate([
            'remarks' => ['required', 'string'],
        ]);

        $certification->update([
            'status' => 'revision_required',
            'remarks' => $validated['remarks'],
            'decline_reason' => null,
        ]);

        return redirect()->back()
            ->with('success', 'Revision requested successfully.');
    }
}
