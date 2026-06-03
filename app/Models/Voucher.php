<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $fillable = [
        'enrollment_request_id',
        'teacher_id',
        'cohort_id',
        'certification_id',
        'code',
        'is_used',
        'used_by',
        'issued_at',
        'used_at',
        'expires_at',
    ];

    protected $casts = [
        'is_used' => 'boolean',
        'issued_at' => 'datetime',
        'used_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function usedByUser()
    {
        return $this->belongsTo(User::class, 'used_by');
    }
}
