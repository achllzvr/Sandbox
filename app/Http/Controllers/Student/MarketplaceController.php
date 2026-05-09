<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Certification;

class MarketplaceController extends Controller {
    public function index() {
        return Inertia::render('Student/Marketplace/Index', [
            'certifications' => Certification::where('status', 'published')->with('creator')->latest()->get()
        ]);
    }
}

