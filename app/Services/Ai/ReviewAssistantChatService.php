<?php

namespace App\Services\Ai;

use App\Models\Certification;
use App\Models\Module;
use App\Models\User;

class ReviewAssistantChatService
{
    public function __construct(
        private GeminiClient $geminiClient,
        private ModuleContentTextExtractor $contentExtractor,
    ) {
    }

    public function moduleHasAssistantContext(Module $module): bool
    {
        $module->loadMissing(['contents', 'questions']);

        if ($module->questions->isNotEmpty()) {
            return true;
        }

        foreach ($module->contents as $content) {
            if (in_array($content->content_type, ['document', 'presentation'], true)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param  array<int, array{role: string, content: string}>  $history
     */
    public function chat(Module $module, Certification $cert, User $user, string $message, array $history = []): string
    {
        if (! $this->moduleHasAssistantContext($module)) {
            throw new \RuntimeException('This sandbox has no review assistant materials yet.');
        }

        $apiKey = trim((string) config('services.gemini.key', ''));

        if ($apiKey === '') {
            throw new \RuntimeException('Review assistant is not configured.');
        }

        $parts = $this->buildParts($module, $cert, $user, $history, $message);

        return $this->geminiClient->generateText($parts, $apiKey, (int) config('services.gemini.timeout', 45));
    }

    /**
     * @param  array<int, array{role: string, content: string}>  $history
     * @return array<int, array<string, mixed>>
     */
    private function buildParts(
        Module $module,
        Certification $cert,
        User $user,
        array $history,
        string $message,
    ): array {
        $module->loadMissing(['contents', 'questions.answers']);

        $systemPrompt = <<<PROMPT
You are Hermy, a friendly study coach helping {$user->first_name} review the sandbox "{$module->title}" in the "{$cert->title}" certification.

Rules:
- Answer only using the sandbox materials and practice quiz reference provided below.
- If the question is outside this sandbox, say you can only help with the current sandbox's content.
- Be concise, encouraging, and exam-focused. Use bullet lists when helpful.
- Never reveal exact quiz answers verbatim; guide the student to understand concepts instead.
PROMPT;

        $parts = [['text' => $systemPrompt]];

        try {
            $materialParts = $this->contentExtractor->extractPartsForReviewAssistant($module);

            if ($materialParts !== []) {
                $parts[] = ['text' => 'Sandbox materials:'];
                $parts = array_merge($parts, $materialParts);
            }
        } catch (\InvalidArgumentException) {
            // Quiz-only sandbox — practice quiz reference may still be available below.
        }

        $quizText = $this->formatQuizReference($module);

        if ($quizText !== '') {
            $parts[] = ['text' => "Practice quiz reference:\n{$quizText}"];
        }

        if (count($parts) === 1) {
            throw new \RuntimeException('This sandbox has no review assistant materials yet.');
        }

        foreach ($history as $turn) {
            $role = ($turn['role'] ?? '') === 'assistant' ? 'Assistant' : 'Student';
            $content = trim((string) ($turn['content'] ?? ''));

            if ($content === '') {
                continue;
            }

            $parts[] = ['text' => "{$role}: {$content}"];
        }

        $parts[] = ['text' => 'Student: '.trim($message)."\nAssistant:"];

        return $parts;
    }

    private function formatQuizReference(Module $module): string
    {
        if ($module->questions->isEmpty()) {
            return '';
        }

        $chunks = [];

        foreach ($module->questions->sortBy('order_index') as $index => $question) {
            $position = $index + 1;
            $block = "Question {$position}: {$question->question_text}";

            if ($question->answers->isNotEmpty()) {
                $answers = $question->answers
                    ->sortBy('id')
                    ->map(fn ($answer, $answerIndex) => chr(65 + $answerIndex).'. '.$answer->answer_text)
                    ->implode("\n");

                $block .= "\nChoices:\n{$answers}";
            }

            $chunks[] = $block;
        }

        return implode("\n\n", $chunks);
    }
}
