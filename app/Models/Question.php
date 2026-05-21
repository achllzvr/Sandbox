<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'module_id',
        'certification_id',
        'created_by_user_id',
        'question_text',
        'question_type',
        'points',
        'order_index',
    ];

    public function createdBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by_user_id');
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function certification()
    {
        return $this->belongsTo(Certification::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}
