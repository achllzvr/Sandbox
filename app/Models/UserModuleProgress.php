<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class UserModuleProgress extends Pivot
{
    protected $table = 'user_module_progress';

    protected $fillable = [
        'user_id',
        'module_id',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];
}
