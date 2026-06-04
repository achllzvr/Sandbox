<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Creator\Concerns\AuthorizesCertificationEditing;
use App\Http\Requests\Creator\StoreCertificationRequest;
use App\Http\Requests\Creator\UpdateCertificationRequest;
use App\Models\Certification;
use App\Services\CertificationService;
use App\Services\CertificationThemeService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CertificationController extends Controller
{
    use AuthorizesCertificationEditing;

    public function __construct(private CertificationService $certService)
    {
    }

    public function index()
    {
        return Inertia::render('Creator/Certifications/Index', [
            'certifications' => auth()->user()->certifications()->latest()->get(['id', 'title', 'description', 'status', 'thumbnail', 'accent_color', 'created_at']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Creator/Certifications/Create');
    }

    public function store(StoreCertificationRequest $request)
    {
        $cert = auth()->user()->certifications()->create(array_merge($request->validated(), ['status' => 'draft']));

        // Create default lesson
        $cert->lessons()->create([
            'title' => 'Course Modules',
            'description' => 'Default lesson containing all modules',
            'created_by_user_id' => auth()->id(),
        ]);

        return redirect()->route('creator.certifications.edit', $cert)->with('success', 'Certification created!');
    }

    public function edit(Certification $certification)
    {
        if ($certification->created_by_user_id !== auth()->id()) {
            abort(403);
        }

        $certification->load([
            'learningMaterials.quizQuestions.answers',
            'examQuestions.answers',
            'diagnosticQuestions.answers',
            'quizQuestions.answers',
            'lessons.modules.contents',
            'lessons.modules.questions.answers',
        ]);

        return Inertia::render('Creator/Certifications/Edit', [
            'certification' => $certification,
            'hasSystemApiKey' => \App\Services\Ai\GeminiKeyPool::isConfigured(),
        ]);
    }

    public function storeExamQuestions(\Illuminate\Http\Request $request, Certification $certification)
    {
        $this->authorizeCertificationEditing($certification);

        $validated = $request->validate([
            'questions' => ['required', 'array', 'min:5'],
            'questions.*.question_text' => ['required', 'string'],
            'questions.*.answers' => ['required', 'array', 'size:4'],
            'questions.*.answers.*.answer_text' => ['required', 'string'],
            'questions.*.answers.*.is_correct' => ['required', 'boolean'],
        ]);

        DB::transaction(function () use ($validated, $certification) {
            $certification->examQuestions()->delete();
            foreach ($validated['questions'] as $qData) {
                $question = $certification->examQuestions()->create([
                    'question_text' => $qData['question_text'],
                    'question_type' => 'final_exam',
                    'created_by_user_id' => auth()->id(),
                ]);
                foreach ($qData['answers'] as $aData) {
                    $question->answers()->create($aData);
                }
            }
        });

        return redirect()->back()->with('success', 'Final Exam questions saved successfully!');
    }

    public function storeDiagnosticQuestions(\Illuminate\Http\Request $request, Certification $certification)
    {
        $this->authorizeCertificationEditing($certification);

        $validated = $request->validate([
            'questions' => ['required', 'array', 'min:1', 'max:5'],
            'questions.*.question_text' => ['required', 'string'],
            'questions.*.answers' => ['required', 'array', 'size:4'],
            'questions.*.answers.*.answer_text' => ['required', 'string'],
            'questions.*.answers.*.is_correct' => ['required', 'boolean'],
        ]);

        DB::transaction(function () use ($validated, $certification) {
            $certification->diagnosticQuestions()->delete();

            foreach ($validated['questions'] as $index => $qData) {
                $question = $certification->diagnosticQuestions()->create([
                    'question_text' => $qData['question_text'],
                    'question_type' => 'diagnostic',
                    'order_index' => $index + 1,
                    'created_by_user_id' => auth()->id(),
                ]);

                foreach ($qData['answers'] as $aData) {
                    $question->answers()->create($aData);
                }
            }
        });

        return redirect()->back()->with('success', 'Quick Test questions saved successfully!');
    }

    public function update(UpdateCertificationRequest $request, Certification $certification)
    {
        $this->authorizeCertificationEditing($certification);

        $data = $request->validated();

        if ($request->hasFile('cover_image')) {
            $data['thumbnail'] = $request->file('cover_image')->store('certification-covers', 'public');
        }

        unset($data['cover_image']);

        $certification->update($data);

        if ($request->hasFile('cover_image')) {
            app(CertificationThemeService::class)->syncFromThumbnail($certification->fresh());
        }

        return redirect()->back()->with('success', 'Certification updated!');
    }

    public function submit(Certification $certification)
    {
        if ($certification->created_by_user_id !== auth()->id()) {
            abort(403);
        }
        try {
            $this->certService->submitForApproval($certification);

            return redirect()->back()->with('success', 'Certification submitted for approval!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
