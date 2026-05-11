<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
    protected $fillable = [
        'title',
        'description',
        'price',
        'pass_threshold',
        'status',
        'created_by_user_id',
        'approved_by',
        'approved_at',
        'decline_reason',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'price'       => 'decimal:2',
    ];

    // ── Relationships ──────────────────────────────────────

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    // ── Scopes ─────────────────────────────────────────────

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}