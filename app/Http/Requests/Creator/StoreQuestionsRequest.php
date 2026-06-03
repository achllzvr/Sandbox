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
            'questions.*.answers.*.answer_text' => ['nullable', 'string'],
            'questions.*.answers.*.is_correct' => ['nullable', 'boolean'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            foreach ($this->input('questions', []) as $index => $question) {
                if (($question['interaction_type'] ?? 'multiple_choice') !== 'multiple_choice') {
                    continue;
                }

                $answers = $question['answers'] ?? [];

                if (count($answers) < 4) {
                    $validator->errors()->add("questions.{$index}.answers", 'Multiple choice questions need four answer options.');
                }

                $correctCount = 0;

                foreach ($answers as $answerIndex => $answer) {
                    if (trim($answer['answer_text'] ?? '') === '') {
                        $validator->errors()->add(
                            "questions.{$index}.answers.{$answerIndex}.answer_text",
                            'Each answer option must have text.'
                        );
                    }

                    if (! empty($answer['is_correct'])) {
                        $correctCount++;
                    }
                }

                if ($correctCount !== 1) {
                    $validator->errors()->add("questions.{$index}.answers", 'Select exactly one correct answer.');
                }
            }
        });
    }
}
