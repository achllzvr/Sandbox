<?php

namespace App\Http\Requests\Creator;

use Illuminate\Foundation\Http\FormRequest;

class StoreCertificationRequest extends FormRequest
{
    public function authorize()
    {
        return request()->user()->role === 'staff';
    }

    public function rules()
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
        ];
    }
}

