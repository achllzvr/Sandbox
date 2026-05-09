<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Http\Requests\Creator\StoreQuestionsRequest;
use Illuminate\Support\Facades\DB;

class QuestionController extends Controller {
    public function store(StoreQuestionsRequest $request, Module $module) {
        DB::transaction(function () use ($request, $module) {
            // Assume we clear old questions or just append
            $module->questions()->delete();
            foreach ($request->validated()['questions'] as $qData) {
                $question = $module->questions()->create(['text' => $qData['text']]);
                foreach ($qData['answers'] as $aData) {
                    $question->answers()->create($aData);
                }
            }
        });
        return redirect()->back()->with('success', 'Questions saved');
    }
}

