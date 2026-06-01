<?php

namespace App\Console\Commands;

use App\Models\Certification;
use App\Services\CertificationThemeService;
use Illuminate\Console\Command;

class SyncCertificationThemes extends Command
{
    protected $signature = 'certifications:sync-themes {--id=* : Limit to specific certification IDs}';

    protected $description = 'Extract dominant cover colors and store accent_color on certifications';

    public function handle(CertificationThemeService $themeService): int
    {
        $query = Certification::query()->whereNotNull('thumbnail');

        $ids = array_filter($this->option('id'));
        if ($ids !== []) {
            $query->whereIn('id', $ids);
        }

        $updated = 0;

        $query->each(function (Certification $certification) use ($themeService, &$updated) {
            $accent = $themeService->syncFromThumbnail($certification);

            if ($accent) {
                $updated++;
                $this->line("Cert #{$certification->id} ({$certification->title}): {$accent}");
            } else {
                $this->warn("Cert #{$certification->id} ({$certification->title}): skipped");
            }
        });

        $this->info("Synced accent colors for {$updated} certification(s).");

        return self::SUCCESS;
    }
}
