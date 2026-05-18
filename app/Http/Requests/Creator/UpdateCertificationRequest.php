<?php

namespace App\Http\Requests\Creator;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCertificationRequest extends FormRequest
{
    public function authorize()
    {
        $certification = $this->route('certification');
        return request()->user()->id === $certification->created_by_user_id
            && $certification->status === 'draft';
    }

    public function rules()
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'category' => ['sometimes', 'string', 'max:255'],
            'difficulty' => ['sometimes', 'string', 'max:255'],
            'estimated_duration' => ['sometimes', 'string', 'max:255'],
            'thumbnail' => ['sometimes', 'string', 'max:255'],
            'learning_objectives' => ['sometimes', 'string'],
            'prerequisites' => ['sometimes', 'string'],
            'tags' => ['sometimes', 'array'],
        ];
    }
}

