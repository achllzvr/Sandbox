<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Module;
use App\Models\Certification;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    public function dashboard() {
        $lessonsCreated = Lesson::where('created_by_staff_id', session('user_id'))->count();
        $modulesUploaded = Module::where('uploaded_by_staff_id', session('user_id'))->count();
        $activeCertifications = Certification::where('is_active', true)->count();

        return view('staff.dashboard', compact('lessonsCreated', 'modulesUploaded', 'activeCertifications'));
    }

    public function createLesson(Request $request) {
        $request->validate([
            'certification_id' => 'required|exists:certifications,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Lesson::create([
            'certification_id' => $request->certification_id,
            'title' => $request->title,
            'description' => $request->description,
            'created_by_staff_id' => session('user_id'),
        ]);

        return redirect()->back()->with('success', 'Lesson successfully created.');
    }

    public function createModule(Request $request) {
        $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content_type' => 'required|string',
            'content_file' => 'nullable|file',
        ]);

        $filePath = null;
        if ($request->hasFile('content_file')) {
            $filePath = $request->file('content_file')->store('modules', 'public');
        }

        Module::create([
            'lesson_id' => $request->lesson_id,
            'title' => $request->title,
            'description' => $request->description,
            'content_type' => $request->content_type,
            'file_path' => $filePath,
            'uploaded_by_staff_id' => session('user_id'),
        ]);

        return redirect()->back()->with('success', 'Module uploaded successfully.');
    }
}