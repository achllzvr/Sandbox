<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Services\Ai\GeminiQuestionNormalizer;
use App\Services\Ai\GeminiUploadProcessor;
use App\Services\Ai\ModuleContentTextExtractor;
use App\Support\UploadLimits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiController extends Controller
{
    public function __construct(
        private ModuleContentTextExtractor $contentExtractor,
        private GeminiQuestionNormalizer $questionNormalizer,
        private GeminiUploadProcessor $uploadProcessor,
    ) {
    }

    /**
     * Generate practice quiz or final exam questions using Gemini.
     */
    public function generateQuestions(Request $request)
    {
        set_time_limit(300);

        $maxFileKb = (int) (UploadLimits::APP_MAX_BYTES / 1024);

        $request->validate([
            'source_mode' => 'required|in:upload,module_contents',
            'prompt_type' => 'required_if:source_mode,upload|nullable|in:text,file',
            'text_prompt' => 'required_if:prompt_type,text|nullable|string',
            'file' => 'nullable|file|mimes:pdf,png,jpg,jpeg,webp,txt|max:'.$maxFileKb,
            'files' => 'nullable|array|max:'.GeminiUploadProcessor::MAX_FILES,
            'files.*' => 'file|mimes:pdf,png,jpg,jpeg,webp,txt|max:'.$maxFileKb,
            'module_id' => 'required_if:source_mode,module_contents|nullable|integer|exists:modules,id',
            'module_content_ids' => 'nullable|array',
            'module_content_ids.*' => 'integer|exists:module_content,id',
            'num_questions' => 'nullable|integer|min:5|max:20',
            'question_types' => 'nullable|array|min:1',
            'question_types.*' => 'string|in:'.implode(',', GeminiQuestionNormalizer::ALL_TYPES),
            'api_key_type' => 'required|in:system,custom',
            'api_key' => 'required_if:api_key_type,custom|nullable|string',
        ]);

        if ($request->input('source_mode') === 'upload' && $request->input('prompt_type') === 'file') {
            $uploads = $this->uploadProcessor->collectUploads($request->file('file'), $request->file('files'));
            if ($uploads === []) {
                return response()->json(['error' => 'Add at least one reference file to scan.'], 422);
            }
        }

        $apiKeyType = $request->input('api_key_type', 'system');
        $apiKey = null;

        if ($apiKeyType === 'custom') {
            $apiKey = trim((string) $request->input('api_key'));
            if ($apiKey === '') {
                return response()->json([
                    'error' => 'Custom API Key is selected but not provided. Please paste your Gemini API Key.',
                ], 422);
            }
        } else {
            $apiKey = trim((string) config('services.gemini.key', ''));
            if ($apiKey === '') {
                return response()->json([
                    'error' => 'The Sandbox system API Key is not configured yet. Please ask the administrator to configure it, or switch to "Use Personal API Key".',
                ], 422);
            }
        }

        $numQuestions = (int) $request->input('num_questions', 5);
        $allowedTypes = $this->questionNormalizer->allowedTypes($request->input('question_types'));

        $systemPrompt = $this->questionNormalizer->buildSystemPrompt($numQuestions, $allowedTypes);

        $parts = [['text' => $systemPrompt]];

        try {
            if ($request->input('source_mode') === 'module_contents') {
                $module = Module::findOrFail((int) $request->input('module_id'));
                $contentParts = $this->contentExtractor->extractPartsForGemini(
                    $module,
                    $request->user(),
                    $request->input('module_content_ids'),
                );
                $parts = array_merge($parts, $contentParts);
            } elseif ($request->input('prompt_type') === 'text') {
                $parts[] = ['text' => (string) $request->input('text_prompt')];
            } else {
                $uploads = $this->uploadProcessor->collectUploads($request->file('file'), $request->file('files'));
                $parts = array_merge($parts, $this->uploadProcessor->buildPartsFromUploads($uploads));
            }
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        try {
            $models = ['gemini-2.5-flash', 'gemini-1.5-flash-002', 'gemini-1.5-pro-002', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-1.0-pro'];
            $lastResponse = null;
            $success = false;
            $result = null;

            foreach ($models as $model) {
                $retries = 0;
                while ($retries < 3) {
                    try {
                        $response = Http::timeout(180)->withHeaders([
                            'Content-Type' => 'application/json',
                        ])->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", [
                            'contents' => [
                                [
                                    'parts' => $parts,
                                ],
                            ],
                            'generationConfig' => [
                                'responseMimeType' => 'application/json',
                            ],
                        ]);

                        if ($response->successful()) {
                            $result = $response->json();
                            $success = true;
                            break 2;
                        }

                        $lastResponse = $response;

                        if ($response->status() === 400 || $response->status() === 401) {
                            break 2;
                        }

                        if ($response->status() === 503 || $response->status() === 429) {
                            $retries++;
                            Log::warning("Gemini model {$model} returned status {$response->status()}. Retrying ({$retries}/3)...");
                            sleep(3);

                            continue;
                        }

                        Log::warning("Gemini model {$model} returned status {$response->status()}. Trying fallback model...");
                        break;
                    } catch (\Exception $e) {
                        Log::warning("Gemini model {$model} generation exception: ".$e->getMessage());
                        break;
                    }
                }
            }

            if (! $success) {
                $status = $lastResponse ? $lastResponse->status() : 500;
                $body = $lastResponse ? $lastResponse->body() : 'No response';
                Log::error('Gemini API Error', [
                    'status' => $status,
                    'body' => $body,
                ]);
                $errorData = $lastResponse ? $lastResponse->json() : null;
                $errorMessage = $errorData['error']['message'] ?? 'Failed to contact Gemini API. Please check your API key.';

                return response()->json(['error' => $errorMessage], 500);
            }

            $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;

            if ($text) {
                if (preg_match('/^\s*```(?:json)?\s*(.*?)\s*```/s', $text, $matches)) {
                    $text = $matches[1];
                } else {
                    $text = preg_replace('/^```(?:json)?\s*/i', '', $text);
                    $text = preg_replace('/\s*```$/', '', $text);
                }
                $text = trim($text);
            }

            if (! $text) {
                return response()->json(['error' => 'Gemini API returned an empty response.'], 500);
            }

            $decoded = json_decode($text, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['error' => 'Failed to parse generated questions as JSON.'], 500);
            }

            if (! isset($decoded['questions']) || ! is_array($decoded['questions'])) {
                return response()->json(['error' => 'Invalid JSON structure returned by AI (missing "questions" key).'], 500);
            }

            $questions = $this->questionNormalizer->normalize($decoded['questions'], $allowedTypes);

            if (count($questions) < 1) {
                return response()->json(['error' => 'No valid questions could be generated from the document.'], 500);
            }

            return response()->json([
                'success' => true,
                'questions' => $questions,
            ]);
        } catch (\Exception $e) {
            Log::error('Gemini generateContent Exception: '.$e->getMessage());

            return response()->json(['error' => 'An unexpected error occurred: '.$e->getMessage()], 500);
        }
    }
}
