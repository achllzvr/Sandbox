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
            ->leftJoin('users as publishers', 'certifications.created_by_user_id', '=', 'publishers.id')
            ->where('certificates.certificate_code', $code)
            ->where('certificates.status', 'valid')
            ->select([
                'certificates.certificate_code',
                'certificates.issued_at',
                'users.first_name',
                'users.last_name',
                'certifications.title as certification_title',
                'publishers.first_name as publisher_first_name',
                'publishers.last_name as publisher_last_name',
            ])
            ->first();

        if (! $certificate) {
            abort(404, 'Certificate not found.');
        }

        $publisherName = trim(
            ($certificate->publisher_first_name ?? '').' '.($certificate->publisher_last_name ?? '')
        );

        return Inertia::render('Certificates/PublicShow', [
            'certificate' => [
                'code' => $certificate->certificate_code,
                'issued_at' => $certificate->issued_at,
                'recipient_name' => trim($certificate->first_name.' '.$certificate->last_name),
                'certification_title' => $certificate->certification_title,
                'publisher_name' => $publisherName !== '' ? $publisherName : 'Certificate Creator',
            ],
        ]);
    }
}
