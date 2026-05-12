<?php

namespace App\Http\Requests\Creator;

use Illuminate\Foundation\Http\FormRequest;

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
            'questions.*.text' => ['required', 'string'],
            'questions.*.answers' => ['required', 'array', 'size:4'],
            'questions.*.answers.*.text' => ['required', 'string'],
            'questions.*.answers.*.is_correct' => ['required', 'boolean'],
        ];
    }
}

