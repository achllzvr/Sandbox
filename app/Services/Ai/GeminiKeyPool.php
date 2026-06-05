<?php

namespace App\Services\Ai;

class GeminiKeyPool
{
    /**
     * System keys in rotation order: primary (GEMINI_API_KEY) first, then numbered pool keys.
     *
     * @return array<int, string>
     */
    public static function systemKeys(): array
    {
        $keys = [];

        $primary = trim((string) config('services.gemini.key', ''));

        if ($primary !== '') {
            $keys[] = $primary;
        }

        for ($index = 1; $index <= 10; $index++) {
            $key = trim((string) config("services.gemini.keys.{$index}", ''));

            if ($key !== '' && ! in_array($key, $keys, true)) {
                $keys[] = $key;
            }
        }

        return $keys;
    }

    public static function isConfigured(): bool
    {
        return self::systemKeys() !== [];
    }
}
