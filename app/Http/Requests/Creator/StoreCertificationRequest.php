<?php

namespace App\Http\Requests\Creator;

use Illuminate\Foundation\Http\FormRequest;

class StoreCertificationRequest extends FormRequest
{
    public function authorize()
    {
        return in_array(request()->user()->role, ['content_creator', 'content_creator'], true);
    }

    public function rules()
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category' => ['nullable', 'string', 'max:255'],
            'difficulty' => ['nullable', 'string', 'max:255'],
            'estimated_duration' => ['nullable', 'string', 'max:255'],
            'thumbnail' => ['nullable', 'string', 'max:255'],
            'learning_objectives' => ['nullable', 'string'],
            'prerequisites' => ['nullable', 'string'],
            'tags' => ['nullable', 'array'],
        ];
    }
}

