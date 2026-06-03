<?php

namespace App\Http\Requests\Creator;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQuestionsRequest extends FormRequest
{
    public function authorize()
    {
        $module = $this->route('module');

        return request()->user()->id === $module->lesson->certification->created_by_user_id;
    }

    public function rules()
    {
        return [
            'questions' => ['required', 'array', 'min:5'],
            'questions.*.question_text' => ['required', 'string'],
            'questions.*.interaction_type' => ['nullable', Rule::in([
                'multiple_choice', 'matching', 'sequence', 'true_false', 'true_false_ai', 'code_complete',
            ])],
            'questions.*.metadata' => ['nullable', 'array'],
            'questions.*.answers' => ['nullable', 'array'],
            'questions.*.answers.*.answer_text' => ['required_with:questions.*.answers', 'string'],
            'questions.*.answers.*.is_correct' => ['required_with:questions.*.answers', 'boolean'],
        ];
    }
}
