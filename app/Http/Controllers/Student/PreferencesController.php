<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class PreferencesController extends Controller
{
    public function updateDefaultShell(Request $request)
    {
        $validated = $request->validate([
            'certification_id' => ['required', 'integer', 'exists:certifications,id'],
        ]);

        $user = $request->user();
        $certificationId = (int) $validated['certification_id'];

        $isEnrolled = Enrollment::where('user_id', $user->id)
            ->where('certification_id', $certificationId)
            ->exists();

        if (! $isEnrolled) {
            return back()->with('error', 'You can only set a shell you are enrolled in as your home shell.');
        }

        $user->default_certification_id = $certificationId;
        $user->save();

        return back()->with('success', 'Home shell updated.');
    }
}
