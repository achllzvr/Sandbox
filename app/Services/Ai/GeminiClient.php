<?php

namespace App\Services\Ai;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiClient
{
    /**
     * @param  array<int, array<string, mixed>>  $parts
     */
    public function generateText(array $parts, string $apiKey, int $timeoutSeconds = 45): string
    {
        $result = $this->generateContent($parts, $apiKey, null, $timeoutSeconds);
        $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;

        if (! is_string($text) || trim($text) === '') {
            throw new \RuntimeException('Gemini API returned an empty text response.');
        }

        return trim($text);
    }

    /**
     * @param  array<int, array<string, mixed>>  $parts
     * @return array<string, mixed>
     */
    public function generateJson(array $parts, string $apiKey, int $timeoutSeconds = 60): array
    {
        $result = $this->generateContent($parts, $apiKey, 'application/json', $timeoutSeconds);
        $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;

        if (! is_string($text) || trim($text) === '') {
            throw new \RuntimeException('Gemini API returned an empty response.');
        }

        $decoded = json_decode($this->stripJsonFence($text), true);

        if (json_last_error() !== JSON_ERROR_NONE || ! is_array($decoded)) {
            throw new \RuntimeException('Failed to parse Gemini response as JSON.');
        }

        return $decoded;
    }

    /**
     * @return array<int, string>
     */
    private function modelsToTry(): array
    {
        $preferred = trim((string) config('services.gemini.model', ''));

        if ($preferred !== '') {
            $models = [$preferred];

            if ($preferred !== 'gemini-2.5-flash-lite') {
                $models[] = 'gemini-2.5-flash-lite';
            }

            return $models;
        }

        return ['gemini-2.5-flash-lite', 'gemini-2.5-flash'];
    }

    /**
     * @param  array<int, array<string, mixed>>  $parts
     * @return array<string, mixed>
     */
    private function generateContent(array $parts, string $apiKey, ?string $responseMimeType, int $timeoutSeconds): array
    {
        GeminiAvailability::assertAvailable();

        $timeoutSeconds = min($timeoutSeconds, (int) config('services.gemini.timeout', 45));
        $lastResponse = null;
        $quotaHit = false;

        foreach ($this->modelsToTry() as $model) {
            try {
                $response = $this->postGenerateContent($model, $parts, $apiKey, $responseMimeType, $timeoutSeconds);

                if ($response->successful()) {
                    return $response->json();
                }

                $lastResponse = $response;
                $errorMessage = $this->extractErrorMessage($response);

                if ($response->status() === 401) {
                    throw new \RuntimeException($errorMessage ?: 'Gemini API key is invalid.');
                }

                if ($this->isQuotaError($response, $errorMessage)) {
                    $quotaHit = true;
                    Log::warning("Gemini model {$model} quota/rate limit: {$errorMessage}");

                    continue;
                }

                if ($this->isModelNotFoundError($response, $errorMessage)) {
                    Log::warning("Gemini model {$model} is unavailable.");

                    continue;
                }

                if ($response->status() === 400) {
                    throw new \RuntimeException($errorMessage ?: 'Gemini rejected the request.');
                }

                if ($response->status() === 503) {
                    Log::warning("Gemini model {$model} temporarily unavailable (503).");

                    continue;
                }

                Log::warning("Gemini model {$model} returned status {$response->status()}.");
            } catch (\RuntimeException $e) {
                throw $e;
            } catch (\Throwable $e) {
                Log::warning("Gemini model {$model} exception: ".$e->getMessage());
            }
        }

        if ($quotaHit) {
            $message = 'Gemini API quota or rate limit reached. Wait a few minutes and try again, or upgrade your Gemini plan.';
            GeminiAvailability::markUnavailable($message);

            throw new \RuntimeException($message);
        }

        throw new \RuntimeException($this->resolveErrorMessage($lastResponse));
    }

    /**
     * @param  array<int, array<string, mixed>>  $parts
     */
    private function postGenerateContent(
        string $model,
        array $parts,
        string $apiKey,
        ?string $responseMimeType,
        int $timeoutSeconds,
    ): Response {
        $payload = [
            'contents' => [
                ['parts' => $parts],
            ],
        ];

        if ($responseMimeType !== null) {
            $payload['generationConfig'] = ['responseMimeType' => $responseMimeType];
        }

        return Http::connectTimeout(5)
            ->timeout($timeoutSeconds)
            ->withHeaders(['Content-Type' => 'application/json'])
            ->post(
                "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}",
                $payload,
            );
    }

    private function extractErrorMessage(Response $response): string
    {
        $errorData = $response->json();

        return is_string($errorData['error']['message'] ?? null)
            ? trim($errorData['error']['message'])
            : '';
    }

    private function isQuotaError(Response $response, string $message): bool
    {
        if ($response->status() === 429) {
            return true;
        }

        $normalized = strtolower($message);

        return str_contains($normalized, 'quota')
            || str_contains($normalized, 'rate limit')
            || str_contains($normalized, 'resource_exhausted')
            || str_contains($normalized, 'exceeded your current quota');
    }

    private function isModelNotFoundError(Response $response, string $message): bool
    {
        if ($response->status() === 404) {
            return true;
        }

        $normalized = strtolower($message);

        return str_contains($normalized, 'not found')
            || str_contains($normalized, 'not supported for generatecontent');
    }

    private function resolveErrorMessage(?Response $response): string
    {
        if ($response === null) {
            return 'Could not reach Gemini API. Check your connection and API key.';
        }

        $message = $this->extractErrorMessage($response);

        return $message !== '' ? $message : 'Gemini request failed. Please try again later.';
    }

    private function stripJsonFence(string $text): string
    {
        if (preg_match('/^\s*```(?:json)?\s*(.*?)\s*```/s', $text, $matches)) {
            return trim($matches[1]);
        }

        $text = preg_replace('/^```(?:json)?\s*/i', '', $text) ?? $text;
        $text = preg_replace('/\s*```$/', '', $text) ?? $text;

        return trim($text);
    }
}
