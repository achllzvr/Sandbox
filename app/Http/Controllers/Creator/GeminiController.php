<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiController extends Controller
{
    /**
     * Generate practice quiz or final exam questions using Gemini 1.5 Flash.
     */
    public function generateQuestions(Request $request)
    {
        $request->validate([
            'prompt_type' => 'required|in:text,file',
            'text_prompt' => 'required_if:prompt_type,text|nullable|string',
            'file' => 'required_if:prompt_type,file|nullable|file|mimes:pdf,png,jpg,jpeg,webp,txt|max:10240', // max 10MB
            'num_questions' => 'nullable|integer|min:5|max:20',
            'api_key_type' => 'required|in:system,custom',
            'api_key' => 'required_if:api_key_type,custom|nullable|string',
        ]);

        $apiKeyType = $request->input('api_key_type', 'system');
        $apiKey = null;

        if ($apiKeyType === 'custom') {
            $apiKey = trim($request->input('api_key'));
            if (!$apiKey) {
                return response()->json([
                    'error' => 'Custom API Key is selected but not provided. Please paste your Gemini API Key.'
                ], 422);
            }
        } else {
            $apiKey = trim(env('GEMINI_API_KEY', ''));
            if (!$apiKey) {
                return response()->json([
                    'error' => 'The Sandbox system API Key is not configured yet in the .env file. Please ask the administrator to configure it, or switch to "Use Personal API Key".'
                ], 422);
            }
        }

        $numQuestions = $request->input('num_questions', 5);

        // Standard system instruction prompt for quiz generation
        $systemPrompt = "Generate a multiple-choice quiz based on the user's uploaded material. Follow these rules:
1. Output MUST be a JSON object with a single root key 'questions'.
2. Each question must have 'question_text' (string) and 'answers' (array of exactly 4 items).
3. Each answer must have 'answer_text' (string) and 'is_correct' (boolean).
4. Exactly one answer must have 'is_correct' set to true, the others must be false.
5. If the uploaded material already contains questions (e.g. is a questionnaire), extract them and convert them to this format. If it contains study material/text, generate exactly {$numQuestions} relevant multiple-choice questions based on the content.
6. Generate exactly {$numQuestions} questions.";

        $parts = [];
        $parts[] = ['text' => $systemPrompt];

        if ($request->input('prompt_type') === 'text') {
            $parts[] = ['text' => $request->input('text_prompt')];
        } else {
            $file = $request->file('file');
            $mimeType = $file->getMimeType();
            
            // For txt/plain files, we can just read them as text to save bandwidth, 
            // but inlineData works perfectly for PDF and images.
            if ($mimeType === 'text/plain') {
                $parts[] = ['text' => file_get_contents($file->getRealPath())];
            } else {
                $base64Data = base64_encode(file_get_contents($file->getRealPath()));
                $parts[] = [
                    'inlineData' => [
                        'mimeType' => $mimeType,
                        'data' => $base64Data
                    ]
                ];
            }
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
                        // Call Gemini API for the current model
                        $response = Http::timeout(60)->withHeaders([
                            'Content-Type' => 'application/json',
                        ])->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", [
                            'contents' => [
                                [
                                    'parts' => $parts
                                ]
                            ],
                            'generationConfig' => [
                                'responseMimeType' => 'application/json',
                            ]
                        ]);

                        if ($response->successful()) {
                            $result = $response->json();
                            $success = true;
                            break 2; // Break both while and foreach loops
                        }

                        $lastResponse = $response;

                        // If the API key is invalid/unauthorized (400, 401), stop immediately.
                        if ($response->status() === 400 || $response->status() === 401) {
                            break 2;
                        }
                        
                        // If it's a temporary high-demand spike (503) or rate limit (429), retry after a short delay
                        if ($response->status() === 503 || $response->status() === 429) {
                            $retries++;
                            Log::warning("Gemini model {$model} returned status {$response->status()}. Retrying ({$retries}/3)...");
                            sleep(3);
                            continue;
                        }

                        // For 404 (model not found) or other errors, break the retry loop and try the next model
                        Log::warning("Gemini model {$model} returned status {$response->status()}. Trying fallback model...");
                        break;
                    } catch (\Exception $e) {
                        Log::warning("Gemini model {$model} generation exception: " . $e->getMessage());
                        break;
                    }
                }
            }

            if (!$success) {
                $status = $lastResponse ? $lastResponse->status() : 500;
                $body = $lastResponse ? $lastResponse->body() : 'No response';
                Log::error('Gemini API Error', [
                    'status' => $status,
                    'body' => $body
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

            if (!$text) {
                return response()->json(['error' => 'Gemini API returned an empty response.'], 500);
            }

            $decoded = json_decode($text, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['error' => 'Failed to parse generated questions as JSON.'], 500);
            }

            if (!isset($decoded['questions']) || !is_array($decoded['questions'])) {
                return response()->json(['error' => 'Invalid JSON structure returned by AI (missing "questions" key).'], 500);
            }

            // Perform simple sanitation & defaults to ensure compatibility with Laravel StoreQuestionsRequest
            $questions = [];
            foreach ($decoded['questions'] as $q) {
                if (empty($q['question_text'])) continue;

                $answers = [];
                $correctCount = 0;
                $rawAnswers = $q['answers'] ?? [];

                // Pad or trim answers to exactly 4 options
                for ($i = 0; $i < 4; $i++) {
                    $ansText = $rawAnswers[$i]['answer_text'] ?? "Option " . ($i + 1);
                    $isCorrect = isset($rawAnswers[$i]['is_correct']) ? (bool)$rawAnswers[$i]['is_correct'] : false;
                    
                    if ($isCorrect) {
                        $correctCount++;
                    }

                    $answers[] = [
                        'answer_text' => $ansText,
                        'is_correct' => $isCorrect
                    ];
                }

                // If no correct answer was marked, or multiple were, default the first one to correct
                if ($correctCount !== 1) {
                    foreach ($answers as $idx => &$ans) {
                        $ans['is_correct'] = ($idx === 0);
                    }
                }

                $questions[] = [
                    'question_text' => $q['question_text'],
                    'answers' => $answers
                ];
            }

            if (count($questions) < 1) {
                return response()->json(['error' => 'No valid questions could be generated from the document.'], 500);
            }

            return response()->json([
                'success' => true,
                'questions' => $questions
            ]);

        } catch (\Exception $e) {
            Log::error('Gemini generateContent Exception: ' . $e->getMessage());
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }
}
