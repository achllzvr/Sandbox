<?php

namespace App\Services;

use App\Models\Certification;
use App\Support\CertificationCover;
use App\Support\CoverColorExtractor;

class CertificationThemeService
{
    public function syncFromThumbnail(Certification $certification): ?string
    {
        $path = CertificationCover::absolutePath($certification->thumbnail, $certification->id);

        if ($path === null) {
            return null;
        }

        $accent = CoverColorExtractor::fromPath($path);

        if ($accent === null) {
            return null;
        }

        if ($certification->accent_color !== $accent) {
            $certification->forceFill(['accent_color' => $accent])->saveQuietly();
        }

        return $accent;
    }
}
