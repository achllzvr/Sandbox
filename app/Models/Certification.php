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
        'is_active',
        'created_by_admin_id',
    ];

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }
}