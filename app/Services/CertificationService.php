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
        if ($cert->learningMaterials->isEmpty()) throw new Exception("At least one learning material must be attached.");
        
        foreach ($cert->lessons as $lesson) {
            if ($lesson->modules->isEmpty()) throw new Exception("Lesson {$lesson->title} must have at least one module");
            
            foreach ($lesson->modules as $module) {
                if ($module->contents->isEmpty()) throw new Exception("Module {$module->title} is missing content");
                if ($module->questions->count() < 5) throw new Exception("Module {$module->title} needs at least 5 questions");
                
                foreach ($module->questions as $question) {
                    if ($question->answers->count() !== 4) throw new Exception("Questions must have exactly 4 answers");
                    if ($question->answers->where('is_correct', true)->count() !== 1) {
                        throw new Exception("Each question needs exactly 1 correct answer");
                    }
                }
            }
        }
    }
}

