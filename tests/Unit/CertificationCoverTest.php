<?php

namespace Tests\Unit;

use App\Support\CertificationCover;
use Tests\TestCase;

class CertificationCoverTest extends TestCase
{
    public function test_resolves_png_thumbnail_to_jpg_on_disk(): void
    {
        $path = CertificationCover::absolutePath('shell-covers/full-demo.png', 1);

        $this->assertNotNull($path);
        $this->assertStringEndsWith('full-demo.jpg', $path);
    }

    public function test_url_points_at_storage_cover_not_fallback(): void
    {
        $url = CertificationCover::url('shell-covers/react-basics.png', 2);

        $this->assertNotNull($url);
        $this->assertStringContainsString('storage/shell-covers/react-basics.jpg', $url);
    }
}
