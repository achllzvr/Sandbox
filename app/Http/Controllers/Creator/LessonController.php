<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Http\Requests\Creator\StoreLessonRequest;

class LessonController extends Controller {
    public function store(StoreLessonRequest $request) {
        Lesson::create($request->validated());
        return redirect()->back()->with('success', 'Lesson created');
    }

    public function destroy(Lesson $lesson) {
        if ($lesson->certification->created_by_user_id !== auth()->id()) abort(403);
        $lesson->delete();
        return redirect()->back()->with('success', 'Lesson deleted');
    }
}

