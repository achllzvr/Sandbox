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
            'title' => ['required', 'string', 'max:150'],
            'type' => ['required', 'in:video,ppt,pdf,youtube_embed'],
            'youtube_url' => ['required_if:type,youtube_embed', 'url', 'nullable'],
            // Removed strict 'mimes' because PPTX is often mistakenly recognized as a 'zip' file by the server's MIME detector.
            'file' => ['required_unless:type,youtube_embed', 'file', 'max:51200', 'nullable'],
        ];
    }
}

