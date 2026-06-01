<?php

namespace App\Support;

class CoverColorExtractor
{
    private const SAMPLE_SIZE = 64;

    /**
     * Extract the dominant saturated color from an image file.
     * Returns #rrggbb or null when extraction fails.
     */
    public static function fromPath(string $absolutePath): ?string
    {
        if (! is_file($absolutePath) || ! extension_loaded('gd')) {
            return null;
        }

        $contents = @file_get_contents($absolutePath);
        if ($contents === false) {
            return null;
        }

        $image = @imagecreatefromstring($contents);
        if ($image === false) {
            return null;
        }

        $width = imagesx($image);
        $height = imagesy($image);
        $sample = imagecreatetruecolor(self::SAMPLE_SIZE, self::SAMPLE_SIZE);

        if ($sample === false) {
            imagedestroy($image);

            return null;
        }

        imagecopyresampled($sample, $image, 0, 0, 0, 0, self::SAMPLE_SIZE, self::SAMPLE_SIZE, $width, $height);
        imagedestroy($image);

        $buckets = [];

        for ($y = 0; $y < self::SAMPLE_SIZE; $y++) {
            for ($x = 0; $x < self::SAMPLE_SIZE; $x++) {
                $rgb = imagecolorat($sample, $x, $y);
                $r = ($rgb >> 16) & 0xFF;
                $g = ($rgb >> 8) & 0xFF;
                $b = $rgb & 0xFF;

                if (self::shouldSkipPixel($r, $g, $b)) {
                    continue;
                }

                $qr = intdiv($r, 16) * 16;
                $qg = intdiv($g, 16) * 16;
                $qb = intdiv($b, 16) * 16;
                $key = $qr.','.$qg.','.$qb;
                $buckets[$key] = ($buckets[$key] ?? 0) + 1;
            }
        }

        imagedestroy($sample);

        if ($buckets === []) {
            return null;
        }

        arsort($buckets);
        [$r, $g, $b] = array_map('intval', explode(',', (string) array_key_first($buckets)));

        return sprintf('#%02x%02x%02x', $r, $g, $b);
    }

    private static function shouldSkipPixel(int $r, int $g, int $b): bool
    {
        $max = max($r, $g, $b);
        $min = min($r, $g, $b);
        $lightness = ($max + $min) / 2 / 255;
        $chroma = $max - $min;

        if ($lightness > 0.92 || $lightness < 0.08) {
            return true;
        }

        if ($chroma < 28) {
            return true;
        }

        return false;
    }
}
