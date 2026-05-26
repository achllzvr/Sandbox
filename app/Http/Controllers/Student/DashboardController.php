<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Enrollment;
use App\Models\Certification;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Sample Gamification State
        $gamification = [
            "sand_dollars" => 1250,
            "streak_days" => 14,
            "hermy_avatar" => asset("images/hermy_default.png"),
            "rank" => "Sandcastle Builder",
            "progress_to_next_rank" => 75,
        ];

        // Fetch Real Enrolled Certifications
        $enrollments = Enrollment::with("certification.lessons.modules")
            ->where("user_id", $user->id)
            ->get();

        $myShells = $enrollments->map(function ($enrollment) {
            $cert = $enrollment->certification;
            $moduleCount = 0;
            // roughly calculate modules:
            foreach($cert->lessons as $l) {
                $moduleCount += $l->modules->count();
            }

            return [
                "id" => $cert->id,
                "title" => $cert->title,
                // Hardcode logic for now, or you can implement actual UserModuleProgress checks later
                "progress" => 0, 
                "total_modules" => $moduleCount,
                "completed_modules" => 0,
                "last_accessed" => "Just now",
                "next_sandbox" => "Module ". $moduleCount,
                "color" => "from-blue-400 to-cyan-300"
            ];
        });

        // Sample Marketplace Recommendations
        $recommendedShells = Certification::whereIn("status", ["approved", "published"])
            ->inRandomOrder()
            ->take(2)
            ->get()
            ->map(function ($cert) {
                return [
                    "id" => $cert->id,
                    "title" => $cert->title,
                    "price" => (float) $cert->price,
                    "creator" => $cert->creator ? $cert->creator->first_name : "Admin",
                    "rating" => 5.0
                ];
            });

        return Inertia::render("Student/Dashboard", [
            "gamification" => $gamification,
            "myShells"     => $myShells,
            "recommendedShells" => $recommendedShells,
        ]);
    }
}
