<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Http\Requests\Creator\StoreLessonRequest;
use App\Models\Certification;
use App\Models\Lesson;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function store(StoreLessonRequest $request, Certification $certification)
    {
        if ($certification->created_by_user_id !== auth()->id()) {
            abort(403);
        }

        $orderIndex = $certification->lessons()->max('order_index') + 1;

        $certification->lessons()->create([
            'title' => $request->validated()['title'],
            'description' => $request->validated()['description'] ?? null,
            'created_by_user_id' => auth()->id(),
            'order_index' => $orderIndex ?: 1,
        ]);

        return redirect()->back()->with('success', 'Shell unit created.');
    }

    public function update(Request $request, Lesson $lesson)
    {
        if ($lesson->certification->created_by_user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $lesson->update($validated);

        return redirect()->back()->with('success', 'Shell unit updated.');
    }

    public function reorder(Request $request, Certification $certification)
    {
        if ($certification->created_by_user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'lessons' => ['required', 'array'],
            'lessons.*.id' => ['required', 'integer', 'exists:lessons,id'],
            'lessons.*.order_index' => ['required', 'integer', 'min:1'],
        ]);

        foreach ($validated['lessons'] as $lessonData) {
            Lesson::where('id', $lessonData['id'])
                ->where('certification_id', $certification->id)
                ->update(['order_index' => $lessonData['order_index']]);
        }

        return redirect()->back()->with('success', 'Shell units reordered.');
    }

    public function destroy(Lesson $lesson)
    {
        if ($lesson->certification->created_by_user_id !== auth()->id()) {
            abort(403);
        }

        if ($lesson->certification->lessons()->count() <= 1) {
            return redirect()->back()->with('error', 'At least one shell unit is required.');
        }

        if ($lesson->modules()->exists()) {
            return redirect()->back()->with('error', 'Move or delete sandboxes in this unit before removing it.');
        }

        $lesson->delete();

        return redirect()->back()->with('success', 'Shell unit deleted.');
    }
}
