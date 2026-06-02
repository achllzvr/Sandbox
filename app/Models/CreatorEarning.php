<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreatorEarning extends Model
{
    protected $fillable = [
        'creator_id',
        'certification_id',
        'payment_id',
        'amount',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function certification(): BelongsTo
    {
        return $this->belongsTo(Certification::class);
    }
}
