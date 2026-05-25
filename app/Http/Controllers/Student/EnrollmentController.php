<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EnrollmentRequest;
use App\Models\Certification;

class EnrollmentController extends Controller
{
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            "certification_id" => "required|exists:certifications,id",
            "payment_method" => "required|string",
            "tos_action_irreversible" => "accepted",
            "tos_privacy_act" => "accepted",
        ]);

        $certification = Certification::findOrFail($validated["certification_id"]);

        // Create the enrollment directly as approved to mimic auto-fulfillment
        \App\Models\Enrollment::firstOrCreate([
            "user_id" => auth()->id(),
            "certification_id" => $certification->id,
        ], [
            "enrolled_at" => now(),
            "status" => "active"
        ]);

        return redirect()->route("student.dashboard")->with("success", "Successfully enrolled! Please check your Active Shells.");
    }
}
