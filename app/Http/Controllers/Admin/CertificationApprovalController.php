<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Certification;
use Illuminate\Http\Request;

class CertificationApprovalController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Certifications/Index', [
            'certifications' => Certification::with('creator:id,first_name,last_name')
                ->latest()
                ->get(),
        ]);
    }

    public function update(Request $request, Certification $certification)
    {
        $request->validate([
            'status'         => ['required', 'in:published,declined'],
            'decline_reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $certification->update([
            'status'         => $request->status,
            'decline_reason' => $request->status === 'declined' ? $request->decline_reason : null,
            'approved_by'    => $request->status === 'published' ? auth()->id() : null,
            'approved_at'    => $request->status === 'published' ? now() : null,
        ]);

        return redirect()->back()
            ->with('success', 'Certification status updated.');
    }
}
