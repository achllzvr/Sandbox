<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Services\Ai\GeminiClient;
use App\Services\Ai\GeminiContentSynthesizer;
use App\Services\Ai\GeminiQuestionNormalizer;
use App\Services\Ai\GeminiUploadProcessor;
use App\Support\UploadLimits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GeminiController extends Controller
{
    public function __construct(
        private GeminiClient $geminiClient,
        private GeminiContentSynthesizer $contentSynthesizer,
        private GeminiQuestionNormalizer $questionNormalizer,
        private GeminiUploadProcessor $uploadProcessor,
    ) {
    }

    /**
     * Generate practice quiz or final exam questions using Gemini.
     */
    public function generateQuestions(Request $request)
    {
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
            'num_questions' => 'nullable|integer|min:10|max:200',
            'question_types' => 'nullable|array|min:1',
            'question_types.*' => 'string|in:'.implode(',', GeminiQuestionNormalizer::ALL_TYPES),
            'api_key_type' => 'required|in:system,custom',
            'api_key' => 'required_if:api_key_type,custom|nullable|string',
        ]);

        $uploads = [];

        if ($request->input('source_mode') === 'upload' && $request->input('prompt_type') === 'file') {
            $uploads = $this->uploadProcessor->collectUploads($request->file('file'), $request->file('files'));
            if ($uploads === []) {
                return response()->json(['error' => 'Add at least one reference file to scan.'], 422);
            }

            $batchError = $this->uploadProcessor->validateUploadBatch($uploads);
            if ($batchError !== null) {
                return response()->json(['error' => $batchError], 422);
            }
        }

        $apiKey = $this->resolveApiKey($request);
        if ($apiKey instanceof \Illuminate\Http\JsonResponse) {
            return $apiKey;
        }

        $sourceUnitCount = $this->countSourceUnits($request, $uploads);
        set_time_limit(min(900, 120 + ($sourceUnitCount * 90)));

        $numQuestions = (int) $request->input('num_questions', 10);
        $allowedTypes = $this->questionNormalizer->allowedTypes($request->input('question_types'));

        try {
            $studyContext = $this->buildStudyContext($request, $uploads, $apiKey);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        $systemPrompt = $this->questionNormalizer->buildSystemPrompt($numQuestions, $allowedTypes);
        $parts = [
            ['text' => $systemPrompt],
            ['text' => "Study material compiled from the source documents:\n\n".$studyContext],
        ];

        try {
            $decoded = $this->geminiClient->generateJson($parts, $apiKey, 180);

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
                'sources_processed' => $sourceUnitCount,
            ]);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            Log::error('Gemini generateContent Exception: '.$e->getMessage());

            return response()->json(['error' => 'An unexpected error occurred: '.$e->getMessage()], 500);
        }
    }

    private function resolveApiKey(Request $request): string|\Illuminate\Http\JsonResponse
    {
        $apiKeyType = $request->input('api_key_type', 'system');

        if ($apiKeyType === 'custom') {
            $apiKey = trim((string) $request->input('api_key'));
            if ($apiKey === '') {
                return response()->json([
                    'error' => 'Custom API Key is selected but not provided. Please paste your Gemini API Key.',
                ], 422);
            }

            return $apiKey;
        }

        $apiKey = trim((string) config('services.gemini.key', ''));
        if ($apiKey === '') {
            return response()->json([
                'error' => 'The Sandbox system API Key is not configured yet. Please ask the administrator to configure it, or switch to "Use Personal API Key".',
            ], 422);
        }

        return $apiKey;
    }

    /**
     * @param  array<int, \Illuminate\Http\UploadedFile>  $uploads
     */
    private function countSourceUnits(Request $request, array $uploads): int
    {
        if ($request->input('source_mode') === 'module_contents') {
            $module = Module::find((int) $request->input('module_id'));
            if (! $module) {
                return 1;
            }

            $query = $module->contents()->orderBy('order_index');
            $contentIds = $request->input('module_content_ids');
            if (! empty($contentIds)) {
                $query->whereIn('id', $contentIds);
            }

            return max(1, $query->count());
        }

        if ($request->input('prompt_type') === 'text') {
            return 1;
        }

        return max(1, count($uploads));
    }

    /**
     * @param  array<int, \Illuminate\Http\UploadedFile>  $uploads
     */
    private function buildStudyContext(Request $request, array $uploads, string $apiKey): string
    {
        if ($request->input('source_mode') === 'module_contents') {
            $module = Module::findOrFail((int) $request->input('module_id'));

            return $this->contentSynthesizer->buildFromModuleContents(
                $module,
                $request->user(),
                $request->input('module_content_ids'),
                $apiKey,
            );
        }

        if ($request->input('prompt_type') === 'text') {
            return $this->contentSynthesizer->buildFromText((string) $request->input('text_prompt'));
        }

        return $this->contentSynthesizer->buildFromUploads($uploads, $apiKey);
    }
}
