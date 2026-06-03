<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserStreak extends Model
{
    protected $fillable = [
        'user_id',
        'current_streak',
        'longest_streak',
        'last_active_date',
    ];

    protected $casts = [
        'last_active_date' => 'date',
    ];
}
