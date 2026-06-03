<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModuleQuizAttempt extends Model
{
    protected $fillable = [
        'user_id',
        'module_id',
        'attempt_number',
        'score',
        'total',
        'passed',
        'answers_json',
        'completed_at',
    ];

    protected $casts = [
        'passed' => 'boolean',
        'answers_json' => 'array',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }
}
