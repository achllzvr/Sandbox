<?php

namespace App\Http\Requests\Creator;

use Illuminate\Foundation\Http\FormRequest;

class StoreLessonRequest extends FormRequest
{
    public function authorize()
    {
        return in_array(request()->user()->role, ['content_creator', 'content_creator'], true);
    }

    public function rules()
    {
        return [
            'certification_id' => ['required', 'exists:certifications,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ];
    }
}

