<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCertificationStatusRequest extends FormRequest
{
    public function authorize()
    {
        return request()->user()->role === 'admin';
    }

    public function rules()
    {
        return [
            'status' => ['required', 'in:approved,published,denied'],
            'decline_reason' => ['required_if:status,denied', 'nullable', 'string', 'max:1000'],
        ];
    }
}

