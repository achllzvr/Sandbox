<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateCertificationStatusRequest;
use App\Models\Certification;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CertificationApprovalController extends Controller
{
    public function index(Request $request)
    {
        $query = Certification::query()
            ->with([
                'creator:id,first_name,last_name',
                'approver:id,first_name,last_name',
                'lessons.modules.contents',
                'quizQuestions',
                'examQuestions',
            ])
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhereHas('creator', function ($q) use ($search) {
                        $q->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $certifications = $query->get()->map(fn (Certification $certification) => $this->formatCertificationSummary($certification));

        return Inertia::render('Admin/Certifications/Index', [
            'certifications' => $certifications,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    private function formatCertificationSummary(Certification $certification): array
    {
        $moduleCount = $certification->lessons->sum(fn ($lesson) => $lesson->modules->count());

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
    }

    public function show(Certification $certification)
    {
        $certification->load([
            'creator:id,first_name,last_name',
            'lessons.modules.contents',
            'lessons.modules.questions.answers',
            'quizQuestions.answers',
            'examQuestions.answers',
        ]);

        $moduleCount = $certification->lessons->sum(function ($lesson) {
            return $lesson->modules->count();
        });

        return Inertia::render('Admin/Certifications/Show', [
            'certification' => array_merge($certification->toArray(), [
                'module_count' => $moduleCount,
                'quiz_questions_count' => $certification->quizQuestions->count(),
                'exam_questions_count' => $certification->examQuestions->count(),
            ]),
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

    public function requestRevision(Request $request, Certification $certification)
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

    public function archive(Certification $certification, AuditLogService $auditLog)
    {
        if ($certification->status === 'archived') {
            return redirect()->back()->with('error', 'This certification is already archived.');
        }

        $certification->update([
            'archived_from_status' => $certification->status,
            'status' => 'archived',
        ]);

        $auditLog->log('certification_archived', auth()->id(), [
            'certification_id' => $certification->id,
            'title' => $certification->title,
        ]);

        return redirect()->back()->with('success', '"'.$certification->title.'" has been archived.');
    }

    public function restore(Certification $certification, AuditLogService $auditLog)
    {
        if ($certification->status !== 'archived') {
            return redirect()->back()->with('error', 'Only archived certifications can be restored.');
        }

        $previous = $certification->archived_from_status;
        $restoredStatus = in_array($previous, ['published', 'approved'], true)
            ? 'published'
            : ($previous ?: 'draft');

        $certification->update([
            'status' => $restoredStatus,
            'archived_from_status' => null,
        ]);

        $auditLog->log('certification_restored', auth()->id(), [
            'certification_id' => $certification->id,
            'title' => $certification->title,
            'status' => $restoredStatus,
        ]);

        return redirect()->back()->with('success', '"'.$certification->title.'" has been restored.');
    }
}
