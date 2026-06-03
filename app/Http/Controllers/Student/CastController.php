<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Services\Student\CastService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CastController extends Controller
{
    public function __construct(private CastService $castService)
    {
    }

    public function index(Request $request)
    {
        return Inertia::render('Student/MyCast', $this->castService->payloadForUser($request->user()));
    }
}
