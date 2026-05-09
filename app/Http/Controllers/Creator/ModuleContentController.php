<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\ModuleContent;
use App\Http\Requests\Creator\StoreModuleContentRequest;

class ModuleContentController extends Controller {
    public function store(StoreModuleContentRequest $request, Module $module) {
        // Handling file upload vs youtube_embed logic
        $data = $request->validated();
        $url = null;
        if ($data['type'] === 'youtube_embed') {
            $url = $data['youtube_url'];
        } else if ($request->hasFile('file')) {
            $url = $request->file('file')->store('module-contents', 'public');
        }

        $module->contents()->create([
            'content_type' => $data['type'],
            'content_url' => $url,
            'uploaded_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Module content uploaded');
    }
}

