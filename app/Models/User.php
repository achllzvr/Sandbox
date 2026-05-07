<?php

namespace App\Models;

use App\Models\EmailVerification;
use App\Models\EnrollmentRequest;
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
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
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

    public function enrollmentRequests()
    {
        return $this->hasMany(EnrollmentRequest::class);
    }

    public function emailVerification()
    {
        return $this->hasOne(EmailVerification::class);
    }

    public function getFullNameAttribute()
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    public function hasVerifiedEmail()
    {
        return ! is_null($this->email_verified_at);
    }

    public function markEmailAsVerified()
    {
        return $this->forceFill([
            'email_verified_at' => now(),
        ])->save();
    }

    public function scopeStaff($query)
    {
        return $query->where('role', 'staff');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
