<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use Inertia\Inertia;

class MarketplaceController extends Controller
{
    public function index()
    {
        $certifications = Certification::whereIn('status', ['approved', 'published'])
            ->with('creator:id,first_name,last_name')
            ->latest()
            ->paginate(12);

        return Inertia::render('Student/Marketplace/Index', [
            'certifications' => $certifications,
        ]);
    }
}
