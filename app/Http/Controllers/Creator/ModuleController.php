<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Http\Requests\Creator\StoreModuleRequest;

class ModuleController extends Controller {
    public function store(StoreModuleRequest $request) {
        Module::create(array_merge($request->validated(), [
            'uploaded_by_content_creator_id' => auth()->id()
        ]));
        return redirect()->back()->with('success', 'Module created');
    }

    public function reorder(\Illuminate\Http\Request $request, \App\Models\Lesson $lesson) {
        if ($lesson->certification->created_by_user_id !== auth()->id()) abort(403);
        $request->validate([
            'modules' => 'required|array',
            'modules.*.id' => 'required|exists:modules,id',
            'modules.*.sequence' => 'required|integer',
        ]);

        foreach ($request->input('modules') as $modData) {
            $lesson->modules()
                ->where('id', $modData['id'])
                ->update(['sequence' => $modData['sequence']]);
        }

        return redirect()->back()->with('success', 'Modules reordered successfully!');
    }

    public function destroy(Module $module) {
        if ($module->lesson->certification->created_by_user_id !== auth()->id()) abort(403);
        $module->delete();
        return redirect()->back()->with('success', 'Module deleted');
    }
}

