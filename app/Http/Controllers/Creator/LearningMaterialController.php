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
            $path = $request->file('file')->store('learning_materials', 'public');
            $data['file_path'] = $path;
        }

        $certification->learningMaterials()->create($data);

        return redirect()->back()->with('success', 'Learning material attached successfully!');
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
}
