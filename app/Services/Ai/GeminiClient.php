<?php

namespace App\Services\Ai;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiClient
{
    /** @var array<int, string> */
    private array $models = [
        'gemini-2.5-flash',
        'gemini-1.5-flash-002',
        'gemini-1.5-pro-002',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro',
        'gemini-1.0-pro',
    ];

    /**
     * @param  array<int, array<string, mixed>>  $parts
     */
    public function generateText(array $parts, string $apiKey, int $timeoutSeconds = 120): string
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
    public function generateJson(array $parts, string $apiKey, int $timeoutSeconds = 180): array
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
     * @param  array<int, array<string, mixed>>  $parts
     * @return array<string, mixed>
     */
    private function generateContent(array $parts, string $apiKey, ?string $responseMimeType, int $timeoutSeconds): array
    {
        $lastResponse = null;

        foreach ($this->models as $model) {
            $retries = 0;

            while ($retries < 3) {
                try {
                    $payload = [
                        'contents' => [
                            ['parts' => $parts],
                        ],
                    ];

                    if ($responseMimeType !== null) {
                        $payload['generationConfig'] = ['responseMimeType' => $responseMimeType];
                    }

                    $response = Http::timeout($timeoutSeconds)
                        ->withHeaders(['Content-Type' => 'application/json'])
                        ->post(
                            "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}",
                            $payload,
                        );

                    if ($response->successful()) {
                        return $response->json();
                    }

                    $lastResponse = $response;

                    if (in_array($response->status(), [400, 401], true)) {
                        break 2;
                    }

                    if (in_array($response->status(), [503, 429], true)) {
                        $retries++;
                        Log::warning("Gemini model {$model} returned status {$response->status()}. Retrying ({$retries}/3)...");
                        sleep(3);

                        continue;
                    }

                    Log::warning("Gemini model {$model} returned status {$response->status()}. Trying fallback model...");
                    break;
                } catch (\Throwable $e) {
                    Log::warning("Gemini model {$model} generation exception: ".$e->getMessage());
                    break;
                }
            }
        }

        throw new \RuntimeException($this->resolveErrorMessage($lastResponse));
    }

    private function resolveErrorMessage(?Response $response): string
    {
        if ($response === null) {
            return 'Failed to contact Gemini API. Please check your API key.';
        }

        $errorData = $response->json();

        return $errorData['error']['message'] ?? 'Failed to contact Gemini API. Please check your API key.';
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
