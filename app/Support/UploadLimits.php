<?php

namespace App\Support;

class UploadLimits
{
    public const APP_MAX_BYTES = 52428800; // 50 MB

    public static function postMaxBytes(): int
    {
        return self::iniSizeToBytes(ini_get('post_max_size') ?: '8M');
    }

    public static function uploadMaxBytes(): int
    {
        return self::iniSizeToBytes(ini_get('upload_max_filesize') ?: '8M');
    }

    public static function forFrontend(): array
    {
        $postMax = self::postMaxBytes();
        $uploadMax = self::uploadMaxBytes();
        $effectiveMax = min($postMax, $uploadMax, self::APP_MAX_BYTES);

        return [
            'appMaxBytes' => self::APP_MAX_BYTES,
            'appMaxLabel' => '50 MB',
            'postMaxBytes' => $postMax,
            'uploadMaxBytes' => $uploadMax,
            'effectiveMaxBytes' => $effectiveMax,
            'serverConfigured' => $effectiveMax >= self::APP_MAX_BYTES,
        ];
    }

    public static function iniSizeToBytes(string $value): int
    {
        $value = trim($value);
        if ($value === '') {
            return 0;
        }

        $unit = strtolower(substr($value, -1));
        $number = (float) $value;

        return (int) match ($unit) {
            'g' => $number * 1024 * 1024 * 1024,
            'm' => $number * 1024 * 1024,
            'k' => $number * 1024,
            default => $number,
        };
    }
}
