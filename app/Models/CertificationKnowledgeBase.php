<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CertificationKnowledgeBase extends Model
{
    protected $fillable = [
        'certification_id',
        'summary',
        'outline',
        'content_hash',
        'status',
        'error_message',
        'generated_at',
    ];

    protected $casts = [
        'outline' => 'array',
        'generated_at' => 'datetime',
    ];

    public function certification(): BelongsTo
    {
        return $this->belongsTo(Certification::class);
    }
}
