<?php

namespace App\Services\Ai;

use App\Models\Question;

class CodeGradingService
{
    public function grade(Question $question, string $studentCode): bool
    {
        $meta = $question->metadata ?? [];
        $expected = trim((string) ($meta['expected_output'] ?? ''));
        $language = strtolower((string) ($meta['language'] ?? 'php'));

        if ($expected === '') {
            return false;
        }

        $normalizedStudent = $this->normalize($studentCode, $language);
        $normalizedExpected = $this->normalize($expected, $language);

        return $normalizedStudent === $normalizedExpected;
    }

    private function normalize(string $code, string $language): string
    {
        $code = trim($code);
        $code = preg_replace('/\s+/', ' ', $code) ?? $code;

        if ($language === 'php') {
            $code = str_replace([';', ' {', '{ ', ' }', '} '], ['', '{', '{', '}', '}'], $code);
        }

        return strtolower($code);
    }
}
