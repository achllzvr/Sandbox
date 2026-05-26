<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuleContent extends Model
{
    protected $table = 'module_content';

    protected $fillable = [
        'module_id', 
        'uploaded_by_user_id', 
        'uploaded_by', 
        'content_type', 
        'title', 
        'file_url', 
        'content_url', 
        'order_index'
    ];

    public function module() {
        return $this->belongsTo(Module::class);
    }

    public function uploader() {
        return $this->belongsTo(User::class, 'uploaded_by_user_id');
    }
}