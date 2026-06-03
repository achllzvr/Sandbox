<?php

namespace App\Services\Ai;

use App\Support\GeminiUploadLimits;
use Illuminate\Http\UploadedFile;

class GeminiUploadProcessor
{
    public const MAX_FILES = GeminiUploadLimits::MAX_FILES;

    /**
     * @return array<int, UploadedFile>
     */
    public function collectUploads(?UploadedFile $single, mixed $multiple): array
    {
        $files = [];

        if ($single instanceof UploadedFile) {
            $files[] = $single;
        }

        if (is_array($multiple)) {
            foreach ($multiple as $file) {
                if ($file instanceof UploadedFile) {
                    $files[] = $file;
                }
            }
        }

        return array_values($files);
    }

    /**
     * @param  array<int, UploadedFile>  $files
     */
    public function validateUploadBatch(array $files): ?string
    {
        return GeminiUploadLimits::validateUploadBatch($files);
    }

    /**
     * @param  array<int, UploadedFile>  $files
     * @return array<int, array<string, mixed>>
     */
    public function buildPartsFromUploads(array $files): array
    {
        $parts = [];

        foreach ($files as $index => $file) {
            $parts = array_merge($parts, $this->buildPartsForFile($file, $index + 1));
        }

        return $parts;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function buildPartsForFile(UploadedFile $file, int $index = 1): array
    {
        if ($file->getSize() > GeminiUploadLimits::maxFileBytes()) {
            throw new \InvalidArgumentException(
                'Each file must be '.GeminiUploadLimits::maxFileLabel().' or smaller.'
            );
        }

        $mimeType = $file->getMimeType() ?: 'application/octet-stream';
        $label = 'Source document '.$index.' ('.$file->getClientOriginalName().')';

        if ($mimeType === 'text/plain') {
            return [['text' => $label."\n\n".file_get_contents($file->getRealPath())]];
        }

        return [
            ['text' => $label],
            [
                'inlineData' => [
                    'mimeType' => $mimeType,
                    'data' => base64_encode(file_get_contents($file->getRealPath())),
                ],
            ],
        ];
    }

    private function formatBytes(int $bytes): string
    {
        return round($bytes / (1024 * 1024)).' MB';
    }
}
