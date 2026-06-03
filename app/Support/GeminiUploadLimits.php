<?php

namespace App\Support;

class GeminiUploadLimits
{
    /** Maximum number of reference files per generation request. */
    public const MAX_FILES = 8;

    /** Bytes reserved for non-file multipart fields (API key, question types, etc.). */
    public const POST_OVERHEAD_BYTES = 2 * 1024 * 1024;

    public static function maxFileBytes(): int
    {
        return min(
            UploadLimits::APP_MAX_BYTES,
            UploadLimits::uploadMaxBytes() ?: UploadLimits::APP_MAX_BYTES,
        );
    }

    public static function maxBatchBytes(): int
    {
        $postBudget = UploadLimits::postMaxBytes() - self::POST_OVERHEAD_BYTES;

        if ($postBudget < 1) {
            $postBudget = UploadLimits::APP_MAX_BYTES;
        }

        // Never advertise more combined upload than the PHP post limit can accept.
        return min($postBudget, self::MAX_FILES * self::maxFileBytes());
    }

    public static function maxFileLabel(): string
    {
        return UploadLimits::forFrontend()['appMaxLabel'];
    }

    public static function maxBatchLabel(): string
    {
        return self::formatBytes(self::maxBatchBytes());
    }

    public static function forFrontend(): array
    {
        return [
            'maxFiles' => self::MAX_FILES,
            'maxFileBytes' => self::maxFileBytes(),
            'maxFileLabel' => self::maxFileLabel(),
            'maxBatchBytes' => self::maxBatchBytes(),
            'maxBatchLabel' => self::maxBatchLabel(),
        ];
    }

    /**
     * @param  array<int, \Illuminate\Http\UploadedFile>  $files
     */
    public static function validateUploadBatch(array $files): ?string
    {
        if ($files === []) {
            return 'Add at least one reference file.';
        }

        if (count($files) > self::MAX_FILES) {
            return 'You can upload up to '.self::MAX_FILES.' files at a time.';
        }

        $totalBytes = 0;
        $maxFileBytes = self::maxFileBytes();
        $maxBatchBytes = self::maxBatchBytes();

        foreach ($files as $file) {
            $size = $file->getSize();

            if ($size > $maxFileBytes) {
                return 'Each file must be '.self::maxFileLabel().' or smaller.';
            }

            $totalBytes += $size;

            if ($totalBytes > $maxBatchBytes) {
                return 'Combined upload size exceeds '.self::maxBatchLabel()
                    .'. Remove a file or use smaller documents.';
            }
        }

        return null;
    }

    public static function formatBytes(int $bytes): string
    {
        if ($bytes >= 1024 * 1024) {
            return round($bytes / (1024 * 1024)).' MB';
        }

        if ($bytes >= 1024) {
            return round($bytes / 1024).' KB';
        }

        return $bytes.' B';
    }
}
