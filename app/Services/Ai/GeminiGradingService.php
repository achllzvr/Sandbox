<?php

namespace App\Services\Ai;

use App\Models\Question;

class GeminiGradingService
{
    public function __construct(private GeminiClient $geminiClient)
    {
    }

    public function gradeTrueFalseAi(Question $question, string $studentAnswer): array
    {
        $reference = trim((string) ($question->metadata['reference_true_statement'] ?? ''));
        $promptStatement = trim($question->question_text);

        if ($reference === '' || trim($studentAnswer) === '') {
            return [
                'is_correct' => false,
                'confidence' => 0.0,
                'feedback' => 'A reference statement and student explanation are required.',
            ];
        }

        $systemPrompt = <<<'PROMPT'
You grade student explanations for a "explain why this statement is false" question.
Return JSON only with keys: is_correct (boolean), confidence (number 0-1), feedback (string).
Mark is_correct true when the student's explanation demonstrates understanding equivalent to the reference true statement, even if wording differs.
PROMPT;

        $userPrompt = "False statement shown to student:\n{$promptStatement}\n\nReference true statement:\n{$reference}\n\nStudent explanation:\n{$studentAnswer}";

        $result = $this->callGemini($systemPrompt, $userPrompt);

        if ($result !== null) {
            return $result;
        }

        return $this->fallbackTrueFalse($reference, $studentAnswer);
    }

    public function gradeCodeComplete(Question $question, string $studentAnswer): array
    {
        $meta = $question->metadata ?? [];
        $expected = trim((string) ($meta['expected_output'] ?? ''));
        $language = strtolower((string) ($meta['language'] ?? 'php'));

        if ($expected === '' || trim($studentAnswer) === '') {
            return [
                'is_correct' => false,
                'confidence' => 0.0,
                'feedback' => 'An expected answer and student submission are required.',
            ];
        }

        $systemPrompt = <<<'PROMPT'
You grade code-completion answers for a learning sandbox.
Return JSON only with keys: is_correct (boolean), confidence (number 0-1), feedback (string).
Accept equivalent solutions that produce the expected result, including minor formatting differences.
PROMPT;

        $userPrompt = "Language: {$language}\nQuestion:\n{$question->question_text}\n\nExpected output / answer:\n{$expected}\n\nStudent submission:\n{$studentAnswer}";

        $result = $this->callGemini($systemPrompt, $userPrompt);

        if ($result !== null) {
            return $result;
        }

        return $this->fallbackCodeComplete($expected, $studentAnswer, $language);
    }

    private function callGemini(string $systemPrompt, string $userPrompt): ?array
    {
        if (! GeminiKeyPool::isConfigured()) {
            return null;
        }

        try {
            $decoded = $this->geminiClient->generateJson(
                [['text' => $systemPrompt."\n\n".$userPrompt]],
                null,
                min(30, (int) config('services.gemini.timeout', 45)),
            );

            if (! array_key_exists('is_correct', $decoded)) {
                return null;
            }

            return [
                'is_correct' => (bool) $decoded['is_correct'],
                'confidence' => isset($decoded['confidence']) ? (float) $decoded['confidence'] : null,
                'feedback' => isset($decoded['feedback']) ? (string) $decoded['feedback'] : null,
            ];
        } catch (\RuntimeException) {
            return null;
        } catch (\Throwable) {
            return null;
        }
    }

    private function fallbackTrueFalse(string $reference, string $studentAnswer): array
    {
        $threshold = (float) config('ai.similarity_threshold', 0.72);
        $score = $this->similarity($reference, $studentAnswer);
        $isCorrect = $score >= $threshold;

        return [
            'is_correct' => $isCorrect,
            'confidence' => round($score, 2),
            'feedback' => $isCorrect
                ? 'Your explanation matches the expected concept.'
                : 'Your explanation does not closely enough match the expected answer.',
        ];
    }

    private function fallbackCodeComplete(string $expected, string $studentAnswer, string $language): array
    {
        $normalizedStudent = $this->normalizeCode($studentAnswer, $language);
        $normalizedExpected = $this->normalizeCode($expected, $language);
        $isCorrect = $normalizedStudent === $normalizedExpected;

        return [
            'is_correct' => $isCorrect,
            'confidence' => $isCorrect ? 1.0 : 0.0,
            'feedback' => $isCorrect
                ? 'Your answer matches the expected output.'
                : 'Your answer does not match the expected output.',
        ];
    }

    private function similarity(string $reference, string $student): float
    {
        $ref = strtolower(trim($reference));
        $ans = strtolower(trim($student));

        if ($ref === $ans) {
            return 1.0;
        }

        similar_text($ref, $ans, $percent);

        return $percent / 100;
    }

    private function normalizeCode(string $code, string $language): string
    {
        $code = trim($code);
        $code = preg_replace('/\s+/', ' ', $code) ?? $code;

        if ($language === 'php') {
            $code = str_replace([';', ' {', '{ ', ' }', '} '], ['', '{', '{', '}', '}'], $code);
        }

        return strtolower($code);
    }
}
