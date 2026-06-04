<?php

namespace App\Support;

use App\Models\Certification;

class CertificationBadge
{
    /**
     * @return array{badge_type: string, badge_label: string, show_verified_icon: bool}
     */
    public static function meta(Certification $certification): array
    {
        $badgeType = $certification->badge_type ?? 'professional_certificate';

        if ($badgeType === 'custom') {
            return [
                'badge_type' => 'custom',
                'badge_label' => trim((string) ($certification->badge_label ?? '')) ?: 'Custom Certificate',
                'show_verified_icon' => (bool) ($certification->show_verified_icon ?? true),
            ];
        }

        return [
            'badge_type' => 'professional_certificate',
            'badge_label' => 'Professional Certificate',
            'show_verified_icon' => true,
        ];
    }
}
