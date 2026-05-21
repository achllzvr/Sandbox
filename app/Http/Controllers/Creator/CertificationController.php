<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Certification;
use App\Services\CertificationService;
use App\Http\Requests\Creator\StoreCertificationRequest;
use App\Http\Requests\Creator\UpdateCertificationRequest;
use Illuminate\Support\Facades\DB;

class CertificationController extends Controller {
    public function __construct(private CertificationService $certService) {}

    public function index() {
        return Inertia::render('Creator/Certifications/Index', [
            'certifications' => auth()->user()->certifications()->latest()->get()
        ]);
    }

    public function create() {
        return Inertia::render('Creator/Certifications/Create');
    }

    public function store(StoreCertificationRequest $request) {
        $cert = auth()->user()->certifications()->create(array_merge($request->validated(), ['status' => 'draft']));
        
        // Create default lesson
        $cert->lessons()->create([
            'title' => 'Course Modules',
            'description' => 'Default lesson containing all modules',
            'created_by_user_id' => auth()->id()
        ]);

        return redirect()->route('creator.certifications.edit', $cert)->with('success', 'Certification created!');
    }

    public function edit(Certification $certification) {
        if ($certification->created_by_user_id !== auth()->id()) abort(403);

        $certification->load(
            'learningMaterials', 
            'quizQuestions.answers',
            'examQuestions.answers'
        );
        return Inertia::render('Creator/Certifications/Edit', ['certification' => $certification]);
    }

    public function storeQuizQuestions(\Illuminate\Http\Request $request, Certification $certification) {
        if ($certification->created_by_user_id !== auth()->id()) abort(403);

        $validated = $request->validate([
            'questions' => ['required', 'array', 'min:5'],
            'questions.*.question_text' => ['required', 'string'],
            'questions.*.answers' => ['required', 'array', 'size:4'],
            'questions.*.answers.*.answer_text' => ['required', 'string'],
            'questions.*.answers.*.is_correct' => ['required', 'boolean'],
        ]);

        DB::transaction(function () use ($validated, $certification) {
            $certification->quizQuestions()->delete();
            foreach ($validated['questions'] as $qData) {
                $question = $certification->quizQuestions()->create([
                    'question_text' => $qData['question_text'],
                    'question_type' => 'module_quiz',
                    'created_by_user_id' => auth()->id(),
                ]);
                foreach ($qData['answers'] as $aData) {
                    $question->answers()->create($aData);
                }
            }
        });

        return redirect()->back()->with('success', 'Certification Quiz questions saved successfully!');
    }

    public function storeExamQuestions(\Illuminate\Http\Request $request, Certification $certification) {
        if ($certification->created_by_user_id !== auth()->id()) abort(403);

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

    public function update(UpdateCertificationRequest $request, Certification $certification) {
        $certification->update($request->validated());
        return redirect()->back()->with('success', 'Certification updated!');
    }

    public function submit(Certification $certification) {
        if ($certification->created_by_user_id !== auth()->id()) abort(403);
        try {
            $this->certService->submitForApproval($certification);
            return redirect()->back()->with('success', 'Certification submitted for approval!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}

