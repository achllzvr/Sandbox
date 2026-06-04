<?php

namespace App\Http\Requests\Creator;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCertificationRequest extends FormRequest
{
    public function authorize()
    {
        $certification = $this->route('certification');

        return request()->user()->id === $certification->created_by_user_id
            && in_array($certification->status, ['draft', 'revision_required']);
    }

    public function rules()
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'category' => ['sometimes', 'string', 'max:255'],
            'difficulty' => ['sometimes', 'string', 'max:255'],
            'estimated_duration' => ['sometimes', 'string', 'max:255'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'cover_image' => ['sometimes', 'file', 'image', 'max:5120', 'mimes:jpg,jpeg,png,webp,gif'],
            'learning_objectives' => ['sometimes', 'string'],
            'prerequisites' => ['sometimes', 'string'],
            'tags' => ['sometimes', 'array'],
            'badge_type' => ['sometimes', 'in:professional_certificate,custom'],
            'badge_label' => ['required_if:badge_type,custom', 'nullable', 'string', 'max:255'],
            'show_verified_icon' => ['sometimes', 'boolean'],
        ];
    }
}
