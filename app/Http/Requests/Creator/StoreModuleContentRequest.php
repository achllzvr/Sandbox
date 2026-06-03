<?php

namespace App\Http\Requests\Creator;

use App\Support\YoutubeEmbedUrl;
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

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->input('type') === 'youtube_embed') {
                if (! YoutubeEmbedUrl::toEmbedUrl($this->input('youtube_url'))) {
                    $validator->errors()->add('youtube_url', 'Please enter a valid YouTube video link.');
                }

                return;
            }

            if (! $this->hasFile('file')) {
                return;
            }

            $extension = strtolower($this->file('file')->getClientOriginalExtension() ?? '');

            if ($this->input('type') === 'ppt' && ! in_array($extension, ['ppt', 'pptx'], true)) {
                $validator->errors()->add('file', 'Upload a PowerPoint file (.ppt or .pptx).');
            }

            if ($this->input('type') === 'pdf' && $extension !== 'pdf') {
                $validator->errors()->add('file', 'Upload a PDF file.');
            }

            if ($this->input('type') === 'video' && ! in_array($extension, ['mp4', 'mov', 'webm'], true)) {
                $validator->errors()->add('file', 'Upload a video file (.mp4, .mov, or .webm).');
            }
        });
    }
}

