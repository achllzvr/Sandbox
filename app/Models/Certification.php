<?php

namespace App\Models;

use App\Support\CertificationCover;
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
        'accent_color',
        'badge_type',
        'badge_label',
        'show_verified_icon',
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
        'archived_from_status',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'submitted_at' => 'datetime',
        'price' => 'decimal:2',
        'tags' => 'array',
        'show_verified_icon' => 'boolean',
    ];

    protected $appends = [
        'thumbnail_url',
    ];

    public function getThumbnailUrlAttribute(): ?string
    {
        return CertificationCover::url($this->thumbnail, $this->id);
    }

    public function isCreatorEditable(): bool
    {
        return in_array($this->status, ['draft', 'revision_required'], true);
    }

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

    public function diagnosticQuestions()
    {
        return $this->hasMany(Question::class, 'certification_id')
            ->where('question_type', 'diagnostic')
            ->orderBy('order_index');
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('order_index');
    }

    public function knowledgeBase()
    {
        return $this->hasOne(CertificationKnowledgeBase::class);
    }

    // ── Scopes ─────────────────────────────────────────────

    public function scopePublished($query)
    {
        return $query->whereIn('status', ['approved', 'published']);
    }
}
