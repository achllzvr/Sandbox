<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
    protected $fillable = [
        'title',
        'description',
        'category',
        'difficulty',
        'estimated_duration',
        'thumbnail',
        'learning_objectives',
        'prerequisites',
        'tags',
        'price',
        'pass_threshold',
        'status',
        'remarks',
        'created_by_user_id',
        'approved_by',
        'approved_at',
        'submitted_at',
        'decline_reason',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'submitted_at' => 'datetime',
        'price'       => 'decimal:2',
        'tags'        => 'array',
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

    public function learningMaterials()
    {
        return $this->hasMany(LearningMaterial::class)->orderBy('order_number')->orderBy('id');
    }

    public function quizQuestions()
    {
        return $this->hasMany(Question::class, 'certification_id')->where('question_type', 'module_quiz');
    }

    public function examQuestions()
    {
        return $this->hasMany(Question::class, 'certification_id')->where('question_type', 'final_exam');
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    // ── Scopes ─────────────────────────────────────────────

    public function scopePublished($query)
    {
        return $query->whereIn('status', ['approved', 'published']);
    }
}