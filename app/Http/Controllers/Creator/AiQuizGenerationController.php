<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Support\UploadLimits;
use Illuminate\Http\Request;

/**
 * Legacy alias for creator.ai.generate-quiz — forwards to GeminiController.
 *
 * @deprecated Use creator.gemini.generate-questions directly.
 */
class AiQuizGenerationController extends Controller
{
    public function __construct(private GeminiController $geminiController)
    {
    }

    public function generate(Request $request)
    {
        $maxFileKb = (int) (UploadLimits::APP_MAX_BYTES / 1024);

        $request->validate([
            'pdf' => 'nullable|file|mimes:pdf,png,jpg,jpeg,webp,txt|max:'.$maxFileKb,
            'file' => 'nullable|file|mimes:pdf,png,jpg,jpeg,webp,txt|max:'.$maxFileKb,
            'count' => 'nullable|integer|min:10|max:200',
            'num_questions' => 'nullable|integer|min:10|max:200',
            'api_key_type' => 'nullable|in:system,custom',
            'api_key' => 'nullable|string',
        ]);

        $upload = $request->file('pdf') ?? $request->file('file');

        $forward = new Request([
            'source_mode' => 'upload',
            'prompt_type' => $upload ? 'file' : 'text',
            'text_prompt' => $request->input('text_prompt'),
            'num_questions' => $request->input('num_questions')
                ?? $request->input('count')
                ?? 5,
            'api_key_type' => $request->input('api_key_type', 'system'),
            'api_key' => $request->input('api_key'),
        ]);

        if ($upload) {
            $forward->files->set('file', $upload);
        }

        $forward->setUserResolver(fn () => $request->user());

        return $this->geminiController->generateQuestions($forward);
    }
}
