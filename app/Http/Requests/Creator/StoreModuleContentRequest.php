<?php

namespace App\Http\Requests\Creator;

use Illuminate\Foundation\Http\FormRequest;

class StoreModuleContentRequest extends FormRequest
{
    public function authorize()
    {
        $module = $this->route('module');
        return request()->user()->id === $module->lesson->certification->created_by_user_id;
    }

    public function rules()
    {
        return [
            'type' => ['required', 'in:video,ppt,pdf,youtube_embed'],
            'youtube_url' => ['required_if:type,youtube_embed', 'url', 'nullable'],
            'file' => ['required_unless:type,youtube_embed', 'file', 'mimes:mp4,ppt,pptx,pdf', 'max:51200', 'nullable'],
        ];
    }
}

