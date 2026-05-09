<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\EnrollmentRequest;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StaffController extends Controller
{
    public function dashboard()
    {
        $certifications = Certification::active()
            ->latest()
            ->get();

        $assignedCertifications = $certifications->count();

        $uploadedLessons = Lesson::where('created_by_staff_id', session('user_id'))
            ->count();

        $uploadedModules = Module::where('uploaded_by_staff_id', session('user_id'))
            ->count();

        $recentLessons = Lesson::where('created_by_staff_id', session('user_id'))
            ->latest()
            ->take(5)
            ->get();

        $recentModules = Module::where('uploaded_by_staff_id', session('user_id'))
            ->latest()
            ->take(5)
            ->get();

        return view('staff.dashboard', compact(
            'certifications',
            'assignedCertifications',
            'uploadedLessons',
            'uploadedModules',
            'recentLessons',
            'recentModules'
        ));
    }

    public function showCreateLesson()
    {
        $certifications = Certification::active()
            ->latest()
            ->get();

        return view('staff.create-lesson', compact('certifications'));
    }

    public function createLesson(Request $request)
    {
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

        return redirect()->back()->with('success', 'Lesson created successfully.');
    }

    public function uploadModule()
    {
        $certifications = Certification::active()
            ->latest()
            ->get();

        $lessons = Lesson::with('certification')
            ->latest()
            ->get();

        $modules = Module::with('lesson.certification')
            ->where('uploaded_by_staff_id', session('user_id'))
            ->latest()
            ->get();

        return view('staff.upload-module', compact(
            'certifications',
            'lessons',
            'modules'
        ));
    }

    public function createModule(Request $request)
    {
        $request->validate([
            'certification_id' => 'required|exists:certifications,id',
            'lesson_title' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'content_type' => 'required|in:document,video,image',
            'content_file' => 'required|file|mimes:pdf,doc,docx,ppt,pptx,mp4,mov,jpg,jpeg,png,gif|max:51200',
            'duration_weeks' => 'required|integer|min:1|max:52',
        ], [
            'content_file.required' => 'Please upload a file for the selected content type.',
            'content_file.mimes' => 'Supported file types are PDF, DOCX, PPT, MP4, MOV, JPG, PNG, GIF.',
        ]);

        $lesson = Lesson::firstOrCreate(
            [
                'certification_id' => $request->certification_id,
                'title' => $request->lesson_title,
            ],
            [
                'description' => null,
                'created_by_staff_id' => session('user_id'),
            ]
        );

        $filePath = null;

        if ($request->hasFile('content_file')) {
            $file = $request->file('content_file');
            $filename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
            $extension = $file->getClientOriginalExtension();
            $storedName = $filename . '-' . time() . '.' . $extension;
            $filePath = $file->storeAs('modules', $storedName, 'public');
        }

        Module::create([
            'lesson_id' => $lesson->id,
            'title' => $request->title,
            'description' => $request->description,
            'content_type' => $request->content_type,
            'file_path' => $filePath,
            'uploaded_by_staff_id' => session('user_id'),
            'duration_weeks' => $request->duration_weeks,
        ]);

        return redirect()->back()->with('success', 'Module uploaded successfully.');
    }

    public function showUploadQuestions(Request $request)
    {
        $staffModules = Module::with('lesson.certification')
            ->where('uploaded_by_staff_id', session('user_id'))
            ->get();

        $selectedModule = null;
        $questions = collect();

        if ($request->filled('module_id')) {
            $selectedModule = Module::where('uploaded_by_staff_id', session('user_id'))
                ->findOrFail($request->module_id);
            $questions = Question::where('module_id', $selectedModule->id)->get();
        }

        return view('staff.upload-questions', compact('staffModules', 'selectedModule', 'questions'));
    }

    public function storeQuestion(Request $request)
    {
        $request->validate([
            'module_id' => 'required|exists:modules,id',
            'question_text' => 'required|string',
            'option_a' => 'required|string|max:255',
            'option_b' => 'required|string|max:255',
            'option_c' => 'required|string|max:255',
            'option_d' => 'required|string|max:255',
            'correct_answer' => 'required|in:a,b,c,d',
        ]);

        $module = Module::where('uploaded_by_staff_id', session('user_id'))
            ->findOrFail($request->module_id);

        if (Question::where('module_id', $module->id)->count() >= 5) {
            return redirect()->back()
                ->withErrors(['limit' => 'This module already has the maximum of 5 questions.'])
                ->withInput();
        }

        Question::create([
            'module_id' => $module->id,
            'question_text' => $request->question_text,
            'option_a' => $request->option_a,
            'option_b' => $request->option_b,
            'option_c' => $request->option_c,
            'option_d' => $request->option_d,
            'correct_answer' => $request->correct_answer,
        ]);

        return redirect()->route('staff.questions.create', ['module_id' => $module->id])
            ->with('success', 'Question added successfully.');
    }

   public function enrollments()
{
    $staffLessonCertIds = Lesson::where('created_by_staff_id', session('user_id'))
        ->pluck('certification_id')
        ->unique();

    $enrollments = EnrollmentRequest::with(['user', 'certification'])
        ->whereIn('certification_id', $staffLessonCertIds)
        ->latest('requested_at')
        ->get();

    return view('staff.enrollments', compact('enrollments'));
}
}
