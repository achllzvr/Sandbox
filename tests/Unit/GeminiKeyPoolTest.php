<?php

namespace Tests\Unit;

use App\Services\Ai\GeminiKeyPool;
use Tests\TestCase;

class GeminiKeyPoolTest extends TestCase
{
    public function test_system_keys_put_primary_first_then_numbered_keys(): void
    {
        config([
            'services.gemini.key' => 'primary-key',
            'services.gemini.keys' => [
                1 => 'pool-key-1',
                2 => 'pool-key-2',
                3 => '',
            ],
        ]);

        $this->assertSame(['primary-key', 'pool-key-1', 'pool-key-2'], GeminiKeyPool::systemKeys());
    }

    public function test_system_keys_deduplicate_primary_when_also_in_pool(): void
    {
        config([
            'services.gemini.key' => 'shared-key',
            'services.gemini.keys' => [
                1 => 'shared-key',
                2 => 'other-key',
            ],
        ]);

        $this->assertSame(['shared-key', 'other-key'], GeminiKeyPool::systemKeys());
    }

    public function test_is_configured_when_any_key_present(): void
    {
        config([
            'services.gemini.key' => '',
            'services.gemini.keys' => [1 => 'only-pool-key'],
        ]);

        $this->assertTrue(GeminiKeyPool::isConfigured());
    }
}
