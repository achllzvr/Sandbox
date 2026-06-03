<?php

namespace App\Services\Ai;

use App\Support\UploadLimits;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

class GeminiUploadProcessor
{
    public const MAX_FILES = 8;

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
     * @return array<int, array<string, mixed>>
     */
    public function buildPartsFromUploads(array $files): array
    {
        $parts = [];

        foreach ($files as $index => $file) {
            if ($file->getSize() > UploadLimits::APP_MAX_BYTES) {
                throw new \InvalidArgumentException(
                    'Each file must be '.$this->formatBytes(UploadLimits::APP_MAX_BYTES).' or smaller.'
                );
            }

            $mimeType = $file->getMimeType() ?: 'application/octet-stream';
            $label = 'Source document '.($index + 1).' ('.$file->getClientOriginalName().')';

            if ($mimeType === 'text/plain') {
                $parts[] = ['text' => $label."\n\n".file_get_contents($file->getRealPath())];
            } else {
                $parts[] = ['text' => $label];
                $parts[] = [
                    'inlineData' => [
                        'mimeType' => $mimeType,
                        'data' => base64_encode(file_get_contents($file->getRealPath())),
                    ],
                ];
            }
        }

        return $parts;
    }

    private function formatBytes(int $bytes): string
    {
        return round($bytes / (1024 * 1024)).' MB';
    }
}
