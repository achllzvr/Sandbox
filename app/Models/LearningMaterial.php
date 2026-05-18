<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningMaterial extends Model
{
    protected $fillable = [
        'certification_id',
        'title',
        'type',
        'file_path',
        'youtube_embed_url',
        'description',
        'order_number',
    ];

    public function certification()
    {
        return $this->belongsTo(Certification::class);
    }
}
