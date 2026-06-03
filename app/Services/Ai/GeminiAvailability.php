<?php

namespace App\Services\Ai;

use Illuminate\Support\Facades\Cache;

class GeminiAvailability
{
    private const CACHE_KEY = 'gemini_api_unavailable';

    public static function isConfigured(): bool
    {
        return trim((string) config('services.gemini.key', '')) !== '';
    }

    public static function isAvailable(): bool
    {
        return self::isConfigured() && self::blockedReason() === null;
    }

    public static function blockedReason(): ?string
    {
        $reason = Cache::get(self::CACHE_KEY);

        return is_string($reason) && $reason !== '' ? $reason : null;
    }

    public static function assertAvailable(): void
    {
        if (! self::isConfigured()) {
            throw new \RuntimeException('Gemini is not configured on this server.');
        }

        $reason = self::blockedReason();

        if ($reason !== null) {
            throw new \RuntimeException($reason);
        }
    }

    public static function markUnavailable(string $reason, int $minutes = 3): void
    {
        Cache::put(self::CACHE_KEY, $reason, now()->addMinutes(max(1, $minutes)));
    }

    public static function clearUnavailable(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
