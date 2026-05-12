<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = [
        'certification_id',
        'title',
        'description',
        'created_by_content_creator_id',
    ];

    public function certification()
    {
        return $this->belongsTo(Certification::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class)->orderBy('sequence');
    }
}