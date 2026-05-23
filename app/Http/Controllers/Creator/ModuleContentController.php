<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\ModuleContent;
use App\Http\Requests\Creator\StoreModuleContentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ModuleContentController extends Controller {
    public function store(StoreModuleContentRequest $request, Module $module) {
        if ($module->lesson->certification->created_by_user_id !== auth()->id()) abort(403);

        $data = $request->validated();
        $url = null;

        if ($data['type'] === 'youtube_embed') {
            $url = $data['youtube_url'];
        } else if ($request->hasFile('file')) {
            $url = $request->file('file')->store('module-contents', 'public');
        }

        // Map request type to database column enum
        $mappedType = match ($data['type']) {
            'ppt' => 'presentation',
            'pdf' => 'document',
            'video' => 'video',
            'youtube_embed' => 'youtube_embed',
            default => 'other'
        };

        $orderIndex = $module->contents()->count() + 1;

        $module->contents()->create([
            'title' => $data['title'],
            'content_type' => $mappedType,
            'file_url' => $url ?? '',
            'uploaded_by_user_id' => auth()->id(),
            'order_index' => $orderIndex,
        ]);

        return redirect()->back()->with('success', 'Module component uploaded successfully!');
    }

    public function reorder(Request $request, Module $module) {
        if ($module->lesson->certification->created_by_user_id !== auth()->id()) abort(403);

        $request->validate([
            'contents' => ['required', 'array'],
            'contents.*.id' => ['required', 'exists:module_content,id'],
            'contents.*.order_index' => ['required', 'integer'],
        ]);

        foreach ($request->input('contents') as $contentData) {
            ModuleContent::where('id', $contentData['id'])
                ->where('module_id', $module->id)
                ->update(['order_index' => $contentData['order_index']]);
        }

        return redirect()->back()->with('success', 'Module components reordered successfully!');
    }

    public function destroy(Module $module, ModuleContent $content) {
        if ($module->lesson->certification->created_by_user_id !== auth()->id()) abort(403);
        if ($content->module_id !== $module->id) abort(404);

        if ($content->content_type !== 'youtube_embed' && $content->file_url) {
            Storage::disk('public')->delete($content->file_url);
        }

        $content->delete();
        return redirect()->back()->with('success', 'Module component deleted successfully!');
    }
}
