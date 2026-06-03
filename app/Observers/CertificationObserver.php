<?php

namespace App\Observers;

use App\Models\Certification;
use App\Services\CertificationThemeService;

class CertificationObserver
{
    public function saved(Certification $certification): void
    {
        if (! $certification->thumbnail) {
            return;
        }

        if ($certification->wasChanged('thumbnail') || empty($certification->accent_color)) {
            app(CertificationThemeService::class)->syncFromThumbnail($certification);
        }
    }
}
