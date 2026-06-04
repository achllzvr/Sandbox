<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Creator\Concerns\AuthorizesCertificationEditing;
use App\Models\Certification;
use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    use AuthorizesCertificationEditing;

    public function store(Request $request, Certification $certification)
    {
        $this->authorizeCertificationEditing($certification);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'lesson_id' => ['nullable', 'integer', 'exists:lessons,id'],
        ]);

        $lesson = isset($validated['lesson_id'])
            ? $certification->lessons()->where('id', $validated['lesson_id'])->first()
            : null;

        if (! $lesson) {
            $lesson = $certification->lessons()->firstOrCreate([
                'title' => 'Course Modules',
            ], [
                'created_by_user_id' => auth()->id(),
                'description' => 'Default lesson containing all modules',
                'order_index' => 1,
            ]);
        }

        $orderIndex = $lesson->modules()->count() + 1;

        $lesson->modules()->create(array_merge($validated, [
            'uploaded_by_user_id' => auth()->id(),
            'uploaded_by_content_creator_id' => auth()->id(),
            'order_index' => $orderIndex,
            'sequence' => $orderIndex,
        ]));

        return redirect()->back()->with('success', 'Sandbox created successfully!');
    }

    public function update(Request $request, Module $module)
    {
        $this->authorizeModuleEditing($module);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'strict_completion' => ['required', 'boolean'],
        ]);

        $module->update($validated);

        return redirect()->back()->with('success', 'Sandbox updated successfully!');
    }

    public function reorder(Request $request, Certification $certification)
    {
        $this->authorizeCertificationEditing($certification);

        $request->validate([
            'modules' => ['required', 'array'],
            'modules.*.id' => ['required', 'exists:modules,id'],
            'modules.*.order_index' => ['required', 'integer'],
        ]);

        foreach ($request->input('modules') as $modData) {
            Module::where('id', $modData['id'])->update([
                'order_index' => $modData['order_index'],
                'sequence' => $modData['order_index'],
            ]);
        }

        return redirect()->back()->with('success', 'Sandboxes reordered successfully!');
    }

    public function destroy(Module $module)
    {
        $this->authorizeModuleEditing($module);
        $module->delete();

        return redirect()->back()->with('success', 'Sandbox deleted successfully!');
    }
}
