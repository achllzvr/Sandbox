<?php

namespace App\Http\Requests\Creator;

use Illuminate\Foundation\Http\FormRequest;

class StoreLessonRequest extends FormRequest
{
    public function authorize()
    {
        return request()->user()->role === 'staff';
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

