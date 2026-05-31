<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class CastController extends Controller
{
    public function index()
    {
        // TODO[backend]: Replace with real cast / social graph data.
        return Inertia::render('Student/MyCast', [
            'cast' => [],
        ]);
    }
}
