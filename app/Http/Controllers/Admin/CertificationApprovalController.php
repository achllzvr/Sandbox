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
            ->where('status', 'pending_review')
            ->with([
                'creator:id,first_name,last_name',
                'approver:id,first_name,last_name',
                'lessons.modules.contents',
                'quizQuestions',
                'examQuestions'
            ])
            ->latest()
            ->get()
            ->map(function (Certification $certification) {
                // Calculate modules and contents
                $moduleCount = $certification->lessons->sum(function($lesson) { return $lesson->modules->count(); });
                
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
                    'module_count' => $moduleCount,
                    'quiz_questions_count' => $certification->quizQuestions->count(),
                    'exam_questions_count' => $certification->examQuestions->count(),
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
            'lessons.modules.contents',
            'quizQuestions.answers',
            'examQuestions.answers'
        ]);

        $moduleCount = $certification->lessons->sum(function($lesson) { return $lesson->modules->count(); });

        return Inertia::render('Admin/Certifications/Show', [
            'certification' => array_merge($certification->toArray(), [
                'module_count' => $moduleCount,
                'quiz_questions_count' => $certification->quizQuestions->count(),
                'exam_questions_count' => $certification->examQuestions->count(),
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
