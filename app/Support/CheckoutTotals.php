<?php

namespace App\Support;

use App\Models\Certification;

class CheckoutTotals
{
    public static function compute(Certification $certification, int $quantity = 1): float
    {
        $quantity = max(1, $quantity);

        return round((float) $certification->price * $quantity, 2);
    }

    public static function matchesExpected(float $expected, float $computed): bool
    {
        return abs($expected - $computed) < 0.01;
    }
}
