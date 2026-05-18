<?php

namespace App\Http\Requests\Creator;

use Illuminate\Foundation\Http\FormRequest;

class StoreLearningMaterialRequest extends FormRequest
{
    public function authorize()
    {
        $certification = $this->route('certification');
        return request()->user()->id === $certification->created_by_user_id
            && in_array($certification->status, ['draft', 'revision_required']);
    }

    public function rules()
    {
        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:ppt,document,youtube_video'],
            'description' => ['nullable', 'string'],
        ];

        if ($this->input('type') === 'youtube_video') {
            $rules['youtube_embed_url'] = ['required', 'url', 'regex:/^https:\/\/www\.youtube\.com\/embed\/.+/'];
        } else {
            $rules['file'] = ['required', 'file'];
            if ($this->input('type') === 'ppt') {
                $rules['file'][] = 'mimes:ppt,pptx';
            } elseif ($this->input('type') === 'document') {
                $rules['file'][] = 'mimes:pdf,doc,docx';
            }
        }

        return $rules;
    }
}
