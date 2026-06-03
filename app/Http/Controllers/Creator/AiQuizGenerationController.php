<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Services\Ai\DocumentQuizGenerator;
use Illuminate\Http\Request;

class AiQuizGenerationController extends Controller
{
    public function __construct(private DocumentQuizGenerator $generator) {}

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'pdf' => ['required', 'file', 'mimes:pdf', 'max:10240'],
            'count' => ['required', 'integer', 'min:5', 'max:'.config('ai.max_questions_per_request', 15)],
            'mode' => ['required', 'in:short_test,final_exam'],
        ]);

        $questions = $this->generator->generateFromPdf(
            $validated['pdf'],
            (int) $validated['count'],
            $validated['mode'],
        );

        return response()->json([
            'questions' => $questions,
            'generated' => count($questions),
            'mode' => $validated['mode'],
        ]);
    }
}
