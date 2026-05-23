<?php

namespace App\Services;

use App\Models\Certification;
use Illuminate\Support\Facades\DB;
use Exception;

class CertificationService {
    public function __construct(private AuditLogService $auditService) {}

    public function submitForApproval(Certification $cert) {
        $this->validateSubmissionRequirements($cert);
        
        $cert->update([
            'status' => 'pending_review',
            'submitted_at' => now(),
        ]);
        $this->auditService->log('SUBMIT_CERTIFICATION', auth()->id(), ['certification_id' => $cert->id]);
    }

    private function validateSubmissionRequirements(Certification $cert) {
        if (empty($cert->title)) throw new Exception("Certification title is required.");
        if (empty($cert->description)) throw new Exception("Certification description is required.");
        if (empty($cert->category)) throw new Exception("Certification category is required.");
        if (empty($cert->difficulty)) throw new Exception("Certification difficulty is required.");
        
        $cert->load(['learningMaterials.quizQuestions.answers', 'examQuestions.answers']);

        if ($cert->learningMaterials->isEmpty()) {
            throw new Exception("At least one learning material must be attached.");
        }
        
        // Validate Final Exam (min 5 questions, each with 4 answers, exactly 1 correct)
        if ($cert->examQuestions->count() < 5) {
            throw new Exception("Final Exam must have at least 5 questions.");
        }
        foreach ($cert->examQuestions as $question) {
            if ($question->answers->count() !== 4) {
                throw new Exception("Exam questions must have exactly 4 answers.");
            }
            if ($question->answers->where('is_correct', true)->count() !== 1) {
                throw new Exception("Each exam question must have exactly 1 correct answer.");
            }
        }

        // Validate practice quizzes attached to learning materials
        foreach ($cert->learningMaterials as $material) {
            if ($material->quizQuestions->isNotEmpty()) {
                if ($material->quizQuestions->count() < 5) {
                    throw new Exception("Practice Quiz for '{$material->title}' must have at least 5 questions if configured.");
                }
                foreach ($material->quizQuestions as $question) {
                    if ($question->answers->count() !== 4) {
                        throw new Exception("Quiz questions for '{$material->title}' must have exactly 4 answers.");
                    }
                    if ($question->answers->where('is_correct', true)->count() !== 1) {
                        throw new Exception("Each quiz question for '{$material->title}' must have exactly 1 correct answer.");
                    }
                }
            }
        }
    }
}

