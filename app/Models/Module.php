<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = [
        'lesson_id',
        'title',
        'description',
        'content_type',
        'file_path',
        'uploaded_by_content_creator_id',
        'uploaded_by_user_id',
        'duration_weeks',
        'strict_completion',
        'sequence',
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function contents()
    {
        return $this->hasMany(ModuleContent::class)->orderBy('order_index');
    }

    public function questions()
    {
        return $this->hasMany(Question::class)->where('question_type', 'module_quiz');
    }
}