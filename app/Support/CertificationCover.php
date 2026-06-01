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
                $fullPath = self::resolveExistingPath($storageRelative);
                if ($fullPath !== null) {
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

        $pathInfo = pathinfo($normalized);
        $dirname = isset($pathInfo['dirname']) && $pathInfo['dirname'] !== '.'
            ? $pathInfo['dirname'].'/'
            : '';
        $basename = $pathInfo['filename'] ?? '';
        $extension = strtolower($pathInfo['extension'] ?? '');

        if ($basename !== '') {
            foreach (['png', 'jpg', 'jpeg', 'webp'] as $altExtension) {
                if ($altExtension !== $extension) {
                    $candidates[] = 'storage/'.$dirname.$basename.'.'.$altExtension;
                }
            }
        }

        return array_values(array_unique($candidates));
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
        return self::resolveExistingPath($relativePath) !== null;
    }

    private static function resolveExistingPath(string $relativePath): ?string
    {
        $publicPath = public_path($relativePath);
        if (is_file($publicPath)) {
            return $publicPath;
        }

        if (str_starts_with($relativePath, 'storage/')) {
            $diskPath = storage_path('app/public/'.substr($relativePath, strlen('storage/')));
            if (is_file($diskPath)) {
                return $diskPath;
            }
        }

        return null;
    }

    private static function publicUrl(string $relativePath): string
    {
        $base = rtrim(Request::getBaseUrl(), '/');

        return $base.'/'.ltrim($relativePath, '/');
    }
}
