<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'birthday',
        'contact_no',
        'affiliation',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function createdCertifications() {
        return $this->hasMany(Certification::class, 'created_by_admin_id');
    }

    public function createdLessons() {
        return $this->hasMany(Lesson::class, 'created_by_staff_id');
    }

    public function uploadedModules() {
        return $this->hasMany(Module::class, 'uploaded_by_staff_id');
    }
}