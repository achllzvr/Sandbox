<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CertificateController extends Controller
{
    public function show(string $code)
    {
        $certificate = DB::table('certificates')
            ->join('users', 'certificates.user_id', '=', 'users.id')
            ->join('certifications', 'certificates.certification_id', '=', 'certifications.id')
            ->where('certificates.certificate_code', $code)
            ->where('certificates.status', 'valid')
            ->select([
                'certificates.certificate_code',
                'certificates.issued_at',
                'users.first_name',
                'users.last_name',
                'certifications.title as certification_title',
            ])
            ->first();

        if (! $certificate) {
            abort(404, 'Certificate not found.');
        }

        return Inertia::render('Certificates/PublicShow', [
            'certificate' => [
                'code' => $certificate->certificate_code,
                'issued_at' => $certificate->issued_at,
                'recipient_name' => trim($certificate->first_name.' '.$certificate->last_name),
                'certification_title' => strtoupper($certificate->certification_title),
            ],
        ]);
    }
}
