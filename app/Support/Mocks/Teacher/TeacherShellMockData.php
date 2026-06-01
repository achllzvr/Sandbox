<?php

namespace App\Support\Mocks\Teacher;

use App\Models\Certification;
use App\Support\CertificationCover;

/**
 * TODO[backend]: Replace with certifications that have cohorts owned by auth teacher.
 */
class TeacherShellMockData
{
    public static function purchasedShells(): array
    {
        $fallback = [
            [
                'id' => 2,
                'title' => 'REACT BASICS',
                'description' => "An exam that covers React's basics from routing to library integrations and basic security.",
                'accent_color' => '#60b0f0',
                'cover_image' => null,
                'badge_type' => 'pro',
                'badge_label' => 'Professional Certificate',
                'batch_count' => 2,
            ],
            [
                'id' => 4,
                'title' => 'LARAVEL BASICS',
                'description' => "An exam that covers Laravel's basics from routing to basic security.",
                'accent_color' => '#f02020',
                'cover_image' => null,
                'badge_type' => 'pro',
                'badge_label' => 'Professional Certificate',
                'batch_count' => 1,
            ],
        ];

        $ids = [2, 4];
        $certs = Certification::query()->whereIn('id', $ids)->get()->keyBy('id');

        return collect($fallback)->map(function (array $shell) use ($certs) {
            $cert = $certs->get($shell['id']);
            if ($cert) {
                $shell['title'] = strtoupper($cert->title);
                $shell['description'] = $cert->description ?? $shell['description'];
                $shell['accent_color'] = $cert->accent_color ?? $shell['accent_color'];
                $shell['cover_image'] = CertificationCover::url($cert->thumbnail, $cert->id);
            }

            return $shell;
        })->values()->all();
    }

    public static function shellDetail(int $certificationId): ?array
    {
        $cert = Certification::query()->find($certificationId);

        if ($cert) {
            return [
                'id' => $cert->id,
                'title' => $cert->title,
                'description' => $cert->description,
                'price' => $cert->price,
                'estimated_duration' => $cert->estimated_duration ?? '2 Weeks',
                'difficulty' => $cert->difficulty ?? '1/5',
                'accent_color' => $cert->accent_color,
                'thumbnail_url' => $cert->thumbnail_url,
                'category' => $cert->category,
            ];
        }

        return TeacherVoucherMockData::fallbackCertification($certificationId);
    }
}
