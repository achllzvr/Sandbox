<?php

namespace App\Services\Ai;

use App\Models\Module;
use App\Models\ModuleContent;
use App\Models\User;
use ZipArchive;

class ModuleContentTextExtractor
{
    public function extractPartsForGemini(Module $module, User $creator, ?array $contentIds = null): array
    {
        $this->assertModuleOwnedByCreator($module, $creator);

        $query = $module->contents()->orderBy('order_index');

        if (! empty($contentIds)) {
            $query->whereIn('id', $contentIds);
        }

        $contents = $query->get();
        $parts = [];

        foreach ($contents as $content) {
            $part = $this->extractContentPart($content);

            if ($part === null) {
                continue;
            }

            $parts[] = ['text' => "Material: {$content->title}"];

            if (isset($part['inlineData'])) {
                $parts[] = $part;
            } else {
                $parts[] = ['text' => $part['text']];
            }
        }

        if ($parts === []) {
            throw new \InvalidArgumentException('No extractable PDF or presentation content was found for the selected materials.');
        }

        return $parts;
    }

    private function assertModuleOwnedByCreator(Module $module, User $creator): void
    {
        $module->loadMissing('lesson.certification');

        if ($module->lesson->certification->created_by_user_id !== $creator->id) {
            abort(403, 'You do not have access to this module.');
        }
    }

    private function extractContentPart(ModuleContent $content): ?array
    {
        $path = $this->resolveFilePath($content);

        if ($path === null || ! is_readable($path)) {
            return null;
        }

        return match ($content->content_type) {
            'document' => $this->extractPdfPart($path),
            'presentation' => $this->extractPresentationPart($path),
            default => null,
        };
    }

    private function resolveFilePath(ModuleContent $content): ?string
    {
        $relative = $content->file_url;

        if (! $relative || preg_match('/^https?:\/\//i', $relative)) {
            return null;
        }

        $normalized = ltrim(str_replace('storage/', '', $relative), '/');

        return storage_path('app/public/'.$normalized);
    }

    private function extractPdfPart(string $path): array
    {
        return [
            'inlineData' => [
                'mimeType' => 'application/pdf',
                'data' => base64_encode((string) file_get_contents($path)),
            ],
        ];
    }

    private function extractPresentationPart(string $path): ?array
    {
        $text = $this->extractPptxText($path);

        if ($text === '') {
            return null;
        }

        return ['text' => $text];
    }

    private function extractPptxText(string $path): string
    {
        $zip = new ZipArchive();

        if ($zip->open($path) !== true) {
            return '';
        }

        $chunks = [];

        for ($i = 0; $i < $zip->numFiles; $i++) {
            $name = $zip->getNameIndex($i);

            if (! is_string($name) || ! preg_match('#^ppt/slides/slide\d+\.xml$#', $name)) {
                continue;
            }

            $xml = $zip->getFromName($name);

            if (! is_string($xml) || $xml === '') {
                continue;
            }

            if (preg_match_all('/<a:t[^>]*>(.*?)<\/a:t>/s', $xml, $matches)) {
                $slideText = implode(' ', array_map(
                    static fn (string $value) => html_entity_decode(strip_tags($value), ENT_QUOTES | ENT_XML1),
                    $matches[1],
                ));

                $slideText = trim(preg_replace('/\s+/', ' ', $slideText) ?? '');

                if ($slideText !== '') {
                    $chunks[] = $slideText;
                }
            }
        }

        $zip->close();

        return trim(implode("\n\n", $chunks));
    }
}
