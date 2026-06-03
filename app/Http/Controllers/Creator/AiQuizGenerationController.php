<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
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
        $request->validate([
            'pdf' => 'nullable|file|mimes:pdf,png,jpg,jpeg,webp,txt|max:10240',
            'file' => 'nullable|file|mimes:pdf,png,jpg,jpeg,webp,txt|max:10240',
            'count' => 'nullable|integer|min:5|max:20',
            'num_questions' => 'nullable|integer|min:5|max:20',
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
