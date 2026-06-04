<?php

namespace App\Services\Ai;

class GeminiKeyPool
{
    /**
     * @return array<int, string>
     */
    public static function systemKeys(): array
    {
        $keys = [];

        for ($index = 1; $index <= 10; $index++) {
            $key = trim((string) config("services.gemini.keys.{$index}", ''));

            if ($key !== '') {
                $keys[] = $key;
            }
        }

        $fallback = trim((string) config('services.gemini.key', ''));

        if ($fallback !== '' && ! in_array($fallback, $keys, true)) {
            $keys[] = $fallback;
        }

        return $keys;
    }

    public static function isConfigured(): bool
    {
        return self::systemKeys() !== [];
    }
}
