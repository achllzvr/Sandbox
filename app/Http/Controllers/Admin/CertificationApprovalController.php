<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Certification;
use App\Http\Requests\Admin\UpdateCertificationStatusRequest;

class CertificationApprovalController extends Controller {
    public function index() {
        return Inertia::render('Admin/Certifications/Pending', [
            'certifications' => Certification::where('status', 'pending_approval')->with('creator')->latest()->get()
        ]);
    }

    public function update(UpdateCertificationStatusRequest $request, Certification $certification) {
        $certification->update([
            'status' => $request->status,
            'decline_reason' => $request->decline_reason,
            'approved_by' => $request->status === 'published' ? auth()->id() : null,
            'approved_at' => $request->status === 'published' ? now() : null,
        ]);
        return redirect()->back()->with('success', 'Certification status updated');
    }
}

