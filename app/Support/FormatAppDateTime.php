<?php

namespace App\Support;

use Carbon\Carbon;

class FormatAppDateTime
{
    public static function format(?Carbon $value, string $format = 'M d, Y; g:ia'): ?string
    {
        if (! $value) {
            return null;
        }

        return $value->timezone(config('app.timezone'))->format($format);
    }
}
