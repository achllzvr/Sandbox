<?php

namespace App\Services\Ai;

use App\Models\Module;
use App\Models\User;
use Illuminate\Http\UploadedFile;

class GeminiContentSynthesizer
{
    private const MAX_CONTEXT_CHARS = 120000;

    public function __construct(
        private GeminiClient $geminiClient,
        private GeminiUploadProcessor $uploadProcessor,
        private ModuleContentTextExtractor $contentExtractor,
    ) {
    }

    /**
     * @param  array<int, UploadedFile>  $uploadFiles
     */
    public function buildFromUploads(array $uploadFiles, ?string $apiKey): string
    {
        $units = [];

        foreach ($uploadFiles as $index => $file) {
            $units[] = [
                'label' => $file->getClientOriginalName(),
                'parts' => $this->uploadProcessor->buildPartsForFile($file, $index + 1),
            ];
        }

        return $this->synthesizeUnits($units, $apiKey);
    }

    public function buildFromText(string $text): string
    {
        $trimmed = trim($text);

        if ($trimmed === '') {
            throw new \InvalidArgumentException('Please enter text to generate questions from.');
        }

        return $this->truncateContext($trimmed);
    }

    /**
     * @param  array<int, int>|null  $contentIds
     */
    public function buildFromModuleContents(Module $module, User $creator, ?array $contentIds, ?string $apiKey): string
    {
        $units = $this->contentExtractor->extractUnitsForGemini($module, $creator, $contentIds);

        return $this->synthesizeUnits($units, $apiKey);
    }

    /**
     * @param  array<int, array{label: string, parts: array<int, array<string, mixed>>}>  $units
     */
    private function synthesizeUnits(array $units, ?string $apiKey): string
    {
        if ($units === []) {
            throw new \InvalidArgumentException('No materials to process.');
        }

        $total = count($units);
        $accumulated = '';

        foreach ($units as $index => $unit) {
            $position = $index + 1;
            $prompt = $this->buildSynthesisPrompt($accumulated, $unit['label'], $position, $total);
            $parts = array_merge([['text' => $prompt]], $unit['parts']);

            $chunk = $this->geminiClient->generateText($parts, $apiKey, 120);
            $accumulated = $this->mergeContext($accumulated, $chunk, $unit['label'], $position);
        }

        return $this->truncateContext($accumulated);
    }

    private function buildSynthesisPrompt(string $previousContext, string $label, int $index, int $total): string
    {
        $header = "You are building cumulative study notes for quiz generation (document {$index} of {$total}): \"{$label}\".\n";

        if ($previousContext === '') {
            return $header
                ."Read the attached material and extract the key concepts, definitions, facts, procedures, and example Q&A.\n"
                .'Return plain text study notes only (no JSON, no markdown fences). Be thorough but concise.';
        }

        return $header
            .'You already processed '.($index - 1)." document(s). Here is the accumulated knowledge so far:\n\n"
            ."--- BEGIN ACCUMULATED NOTES ---\n"
            .$previousContext
            ."\n--- END ACCUMULATED NOTES ---\n\n"
            ."Now read the new attached material. Merge its important content into the accumulated notes.\n"
            ."Remove duplication, keep terminology consistent, and preserve details useful for exam questions.\n"
            .'Return the FULL updated plain-text study notes (not a diff). No JSON, no markdown fences.';
    }

    private function mergeContext(string $previous, string $chunk, string $label, int $position): string
    {
        $chunk = trim($chunk);

        if ($chunk === '') {
            return $previous;
        }

        if ($previous === '') {
            return "=== Source {$position}: {$label} ===\n{$chunk}";
        }

        return $previous."\n\n=== Source {$position}: {$label} ===\n{$chunk}";
    }

    private function truncateContext(string $context): string
    {
        $context = trim($context);

        if ($context === '') {
            throw new \RuntimeException('Could not extract study material from the uploaded files.');
        }

        if (strlen($context) <= self::MAX_CONTEXT_CHARS) {
            return $context;
        }

        return substr($context, 0, self::MAX_CONTEXT_CHARS)
            ."\n\n[Notes truncated because the combined source material was very large.]";
    }
}
