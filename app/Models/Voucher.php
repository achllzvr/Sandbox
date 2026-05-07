<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'max_uses',
        'uses_count',
        'expires_at',
        'created_by_admin_id',
    ];

    protected $casts = [
        'expires_at' => 'date',
    ];
}
