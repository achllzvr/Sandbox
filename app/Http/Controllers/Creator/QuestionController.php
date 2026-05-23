<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Http\Requests\Creator\StoreQuestionsRequest;
use Illuminate\Support\Facades\DB;

class QuestionController extends Controller {
    public function store(StoreQuestionsRequest $request, Module $module) {
        if ($module->lesson->certification->created_by_user_id !== auth()->id()) abort(403);

        DB::transaction(function () use ($request, $module) {
            // Delete old quiz questions for this module
            $module->questions()->delete();
            
            foreach ($request->validated()['questions'] as $qData) {
                $question = $module->questions()->create([
                    'question_text' => $qData['question_text'],
                    'question_type' => 'module_quiz',
                    'created_by_user_id' => auth()->id(),
                    'certification_id' => $module->lesson->certification_id,
                ]);
                
                foreach ($qData['answers'] as $aData) {
                    $question->answers()->create([
                        'answer_text' => $aData['answer_text'],
                        'is_correct' => $aData['is_correct'],
                    ]);
                }
            }
        });
        
        return redirect()->back()->with('success', 'Practice quiz questions saved successfully!');
    }
}
