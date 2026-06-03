<?php

namespace App\Services\Ai;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class DocumentQuizGenerator
{
    public function generateFromPdf(UploadedFile $file, int $count, string $mode = 'short_test'): array
    {
        $text = $this->extractPdfText($file);
        $sentences = $this->splitSentences($text);

        if (count($sentences) < $count) {
            $sentences = array_merge($sentences, $this->fallbackSentences($count));
        }

        $questions = [];
        for ($i = 0; $i < $count; $i++) {
            $fact = $sentences[$i % count($sentences)];
            $questions[] = $this->buildMcQuestion($fact, $i + 1, $mode);
        }

        return $questions;
    }

    private function extractPdfText(UploadedFile $file): string
    {
        $contents = file_get_contents($file->getRealPath()) ?: '';

        if (preg_match_all('/\(([^\)\\]{8,})\)/', $contents, $matches)) {
            $text = implode(' ', $matches[1]);

            return preg_replace('/\s+/', ' ', $text) ?: $this->fallbackText();
        }

        return $this->fallbackText();
    }

    private function splitSentences(string $text): array
    {
        $parts = preg_split('/(?<=[.!?])\s+/', $text) ?: [];

        return array_values(array_filter(array_map('trim', $parts), fn ($s) => strlen($s) > 20));
    }

    private function buildMcQuestion(string $fact, int $index, string $mode): array
    {
        $stem = $mode === 'final_exam'
            ? "Based on the material, which statement best reflects concept {$index}?"
            : "According to the document, which statement is correct about topic {$index}?";

        $distractors = [
            'This concept is unrelated to the uploaded material.',
            'The document explicitly contradicts this statement.',
            'This applies only to admin accounts, not learners.',
        ];

        shuffle($distractors);

        return [
            'question_text' => $stem.' "'.$this->truncate($fact, 120).'"',
            'interaction_type' => 'multiple_choice',
            'answers' => [
                ['answer_text' => $this->truncate($fact, 180), 'is_correct' => true],
                ['answer_text' => $distractors[0], 'is_correct' => false],
                ['answer_text' => $distractors[1], 'is_correct' => false],
                ['answer_text' => $distractors[2], 'is_correct' => false],
            ],
        ];
    }

    private function truncate(string $text, int $max): string
    {
        return Str::limit(trim($text), $max);
    }

    private function fallbackText(): string
    {
        return 'Sandboxes teach skills through modules, quizzes, and a final exam. Learners earn sand dollars for progress.';
    }

    private function fallbackSentences(int $count): array
    {
        $pool = [
            'Sandboxes are interactive learning modules inside a certification shell.',
            'Quiz-only sandboxes contain at least five practice questions.',
            'Final exams unlock after all sandboxes are completed.',
            'Sand dollars reward quiz performance and daily activity.',
            'Enrollment grants access to a specific shell map.',
            'Content creators submit shells for admin approval.',
            'Module content can include video, PDF, and presentation files.',
            'Streaks track consecutive days of learning activity.',
        ];

        return array_slice($pool, 0, max(5, $count));
    }
}
