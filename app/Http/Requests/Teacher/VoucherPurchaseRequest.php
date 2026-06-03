<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class VoucherPurchaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'teacher';
    }

    public function rules(): array
    {
        return [
            'certification_id' => ['required', 'integer', 'exists:certifications,id'],
            'quantity' => ['required', 'integer', 'min:1', 'max:100'],
        ];
    }
}
