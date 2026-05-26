<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\LearningMaterial;
use App\Http\Requests\Creator\StoreLearningMaterialRequest;
use Illuminate\Support\Facades\Storage;

class LearningMaterialController extends Controller
{
    public function store(StoreLearningMaterialRequest $request, Certification $certification)
    {
        $data = $request->validated();
        $data['certification_id'] = $certification->id;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = \Illuminate\Support\Str::random(40) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('learning_materials', $filename, 'public');
            $data['file_path'] = $path;
        }

        $certification->learningMaterials()->create($data);

        return redirect()->back()->with('success', 'Learning material attached successfully!');
    }

    public function reorder(\Illuminate\Http\Request $request, Certification $certification)
    {
        if (auth()->id() !== $certification->created_by_user_id) {
            abort(403);
        }

        $request->validate([
            'materials' => 'required|array',
            'materials.*.id' => 'required|exists:learning_materials,id',
            'materials.*.order_number' => 'required|integer',
        ]);

        foreach ($request->input('materials') as $matData) {
            $certification->learningMaterials()
                ->where('id', $matData['id'])
                ->update(['order_number' => $matData['order_number']]);
        }

        return redirect()->back()->with('success', 'Sequence updated successfully!');
    }

    public function destroy(Certification $certification, LearningMaterial $material)
    {
        if (auth()->id() !== $certification->created_by_user_id || $material->certification_id !== $certification->id) {
            abort(403);
        }

        if ($material->file_path) {
            Storage::disk('public')->delete($material->file_path);
        }
        $material->delete();

        return redirect()->back()->with('success', 'Learning material removed!');
    }

    public function storeQuizQuestions(\Illuminate\Http\Request $request, Certification $certification, LearningMaterial $material)
    {
        if ($certification->created_by_user_id !== auth()->id() || $material->certification_id !== $certification->id) {
            abort(403);
        }

        $validated = $request->validate([
            'questions' => ['required', 'array', 'min:5'],
            'questions.*.question_text' => ['required', 'string'],
            'questions.*.answers' => ['required', 'array', 'size:4'],
            'questions.*.answers.*.answer_text' => ['required', 'string'],
            'questions.*.answers.*.is_correct' => ['required', 'boolean'],
        ]);

        \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $material) {
            $material->quizQuestions()->delete();
            foreach ($validated['questions'] as $qData) {
                $question = $material->quizQuestions()->create([
                    'question_text' => $qData['question_text'],
                    'question_type' => 'module_quiz',
                    'created_by_user_id' => auth()->id(),
                ]);
                foreach ($qData['answers'] as $aData) {
                    $question->answers()->create($aData);
                }
            }
        });

        return redirect()->back()->with('success', 'Practice Quiz saved successfully!');
    }
}
