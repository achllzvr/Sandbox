<?php

namespace App\Http\Controllers\Creator;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Certification;
use App\Services\CertificationService;
use App\Http\Requests\Creator\StoreCertificationRequest;
use App\Http\Requests\Creator\UpdateCertificationRequest;

class CertificationController extends Controller {
    public function __construct(private CertificationService $certService) {}

    public function index() {
        return Inertia::render('Creator/Certifications/Index', [
            'certifications' => auth()->user()->certifications()->latest()->get()
        ]);
    }

    public function create() {
        return Inertia::render('Creator/Certifications/Create');
    }

    public function store(StoreCertificationRequest $request) {
        $cert = auth()->user()->certifications()->create(array_merge($request->validated(), ['status' => 'draft']));
        return redirect()->route('creator.certifications.edit', $cert)->with('success', 'Certification created!');
    }

    public function edit(Certification $certification) {
        if ($certification->created_by !== auth()->id()) abort(403);
        $certification->load('lessons.modules.contents', 'lessons.modules.questions.answers');
        return Inertia::render('Creator/Certifications/Edit', ['certification' => $certification]);
    }

    public function update(UpdateCertificationRequest $request, Certification $certification) {
        $certification->update($request->validated());
        return redirect()->back()->with('success', 'Certification updated!');
    }

    public function submit(Certification $certification) {
        if ($certification->created_by !== auth()->id()) abort(403);
        try {
            $this->certService->submitForApproval($certification);
            return redirect()->back()->with('success', 'Certification submitted for approval!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}

