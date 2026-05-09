<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuleContent extends Model
{
    protected $table = 'module_content';

    protected $fillable = [
        'module_id', 'content_url', 'content_type', 'uploaded_by'
    ];

    public function module() {
        return $this->belongsTo(Module::class);
    }

    public function uploader() {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}