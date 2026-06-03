<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class EnrollmentCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'user';
    }

    public function rules(): array
    {
        return [
            'certification_id' => ['required', 'integer', 'exists:certifications,id'],
            'expected_total' => ['required', 'numeric', 'min:0'],
            'payment_method' => ['required', 'string', 'in:xendit'],
            'tos_action_irreversible' => ['accepted'],
            'tos_privacy_act' => ['accepted'],
        ];
    }
}
