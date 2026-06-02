<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WithdrawalRequest extends Model
{
    protected $fillable = [
        'creator_id',
        'amount',
        'status',
        'requested_at',
        'approved_by',
        'approved_at',
        'paid_at',
        'remarks',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
        'paid_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }
}
