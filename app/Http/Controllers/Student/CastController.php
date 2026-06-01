<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Support\Mocks\StudentCastMockData;
use Inertia\Inertia;

class CastController extends Controller
{
    public function index()
    {
        // TODO[backend]: Return [] when the student has no cast_members rows.
        // TODO[backend]: Join casts → vouchers → certifications → teacher users.
        // TODO[backend]: Aggregate member progress from enrollments + user_module_progress.
        return Inertia::render('Student/MyCast', StudentCastMockData::payload());
    }
}
