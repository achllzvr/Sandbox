<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GamificationEvent extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'event_type',
        'amount',
        'source_type',
        'source_id',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
        'created_at' => 'datetime',
    ];
}
