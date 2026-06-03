<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Services\Ai\GeminiAvailability;
use App\Services\Ai\ReviewAssistantChatService;
use Illuminate\Http\Request;

class StudentReviewAssistantController extends Controller
{
    public function __construct(private ReviewAssistantChatService $chatService)
    {
    }

    public function status(Module $module)
    {
        $module->loadMissing('lesson.certification');
        $certification = $module->lesson->certification;

        $blockedReason = GeminiAvailability::blockedReason();
        $configured = GeminiAvailability::isConfigured();
        $hasContext = $this->chatService->moduleHasAssistantContext($module);

        return response()->json([
            'ready' => $configured && $blockedReason === null && $hasContext,
            'configured' => $configured,
            'has_context' => $hasContext,
            'unavailable_reason' => $blockedReason,
            'module_title' => $module->title,
            'certification_title' => $certification->title,
        ]);
    }

    public function chat(Request $request, Module $module)
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
            'history' => ['nullable', 'array', 'max:20'],
            'history.*.role' => ['required_with:history', 'in:user,assistant'],
            'history.*.content' => ['required_with:history', 'string', 'max:4000'],
        ]);

        $module->loadMissing('lesson.certification');
        $certification = $module->lesson->certification;

        if (! $this->chatService->moduleHasAssistantContext($module)) {
            return response()->json([
                'error' => 'Review assistant is not available for this sandbox.',
            ], 503);
        }

        try {
            $reply = $this->chatService->chat(
                $module,
                $certification,
                $request->user(),
                $validated['message'],
                $validated['history'] ?? [],
            );

            return response()->json(['reply' => $reply]);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 503);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Could not generate a response. Please try again.'], 500);
        }
    }
}
