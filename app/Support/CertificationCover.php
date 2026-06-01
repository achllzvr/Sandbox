<?php

namespace App\Support;

use Illuminate\Support\Facades\Request;

class CertificationCover
{
    /**
     * Resolve a public URL for a certification cover/thumbnail.
     * Uses the current request base so artisan serve and XAMPP both work.
     */
    public static function url(?string $thumbnail, ?int $certificationId = null): ?string
    {
        if (! empty($thumbnail)) {
            foreach (self::thumbnailCandidates($thumbnail) as $storageRelative) {
                if (self::publicFileExists($storageRelative)) {
                    return self::publicUrl($storageRelative);
                }
            }
        }

        $fallback = self::defaultCoverRelative($certificationId);

        return $fallback ? self::publicUrl($fallback) : null;
    }

    /**
     * Resolve an absolute filesystem path for color extraction or file operations.
     */
    public static function absolutePath(?string $thumbnail, ?int $certificationId = null): ?string
    {
        if (! empty($thumbnail)) {
            foreach (self::thumbnailCandidates($thumbnail) as $storageRelative) {
                $fullPath = public_path($storageRelative);
                if (is_file($fullPath)) {
                    return $fullPath;
                }
            }
        }

        $fallback = self::defaultCoverRelative($certificationId);
        if ($fallback === null) {
            return null;
        }

        $fullPath = public_path($fallback);

        return is_file($fullPath) ? $fullPath : null;
    }

    /**
     * @return list<string>
     */
    private static function thumbnailCandidates(string $thumbnail): array
    {
        $normalized = ltrim($thumbnail, '/');
        $candidates = ['storage/'.$normalized];

        if (str_ends_with($normalized, '.jpg')) {
            $candidates[] = 'storage/'.substr($normalized, 0, -4).'.png';
        } elseif (str_ends_with($normalized, '.jpeg')) {
            $candidates[] = 'storage/'.substr($normalized, 0, -5).'.png';
        }

        return $candidates;
    }

    private static function defaultCoverRelative(?int $certificationId): ?string
    {
        if ($certificationId === null) {
            return null;
        }

        $variants = [
            'images/shells/shell_var1.png',
            'images/shells/shell_var2.png',
            'images/shells/shell_var3.png',
            'images/shells/shell_var4.png',
        ];

        $index = max(0, ($certificationId - 1) % count($variants));

        $path = $variants[$index];

        return self::publicFileExists($path) ? $path : null;
    }

    private static function publicFileExists(string $relativePath): bool
    {
        return is_file(public_path($relativePath));
    }

    private static function publicUrl(string $relativePath): string
    {
        $base = rtrim(Request::getBaseUrl(), '/');

        return $base.'/'.ltrim($relativePath, '/');
    }
}
