<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    public const ROLE_ADMIN = 'admin';
    public const ROLE_STAFF = 'content_creator';
    public const ROLE_CONTENT_CREATOR = 'content_creator';
    public const ROLE_TEACHER = 'teacher';
    public const ROLE_USER = 'user';

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
        'status',
        'institutional_credentials_url',
        'verified_by',
        'verified_at',
        'sand_dollars',
        'default_certification_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'verified_at' => 'datetime',
        'birthday' => 'date',
        'sand_dollars' => 'integer',
        'is_active' => 'boolean',
    ];
    protected $appends = [
        'full_name',
    ];

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    public function certifications()
    {
        return $this->hasMany(Certification::class, 'created_by_user_id');
    }

    public function approvedCertifications()
    {
        return $this->hasMany(Certification::class, 'approved_by');
    }

    public function uploadedModuleContents()
    {
        return $this->hasMany(ModuleContent::class, 'uploaded_by');
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class, 'user_id');
    }

    public function completedModules()
    {
        return $this->belongsToMany(Module::class, 'user_module_progress')
            ->using(UserModuleProgress::class)
            ->wherePivot('is_completed', 1)
            ->withPivot('completed_at', 'is_completed')
            ->withTimestamps();
    }

    public function verifiedTeachers()
    {
        return $this->hasMany(User::class, 'verified_by');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', self::ROLE_ADMIN);
    }

    public function scopeStaff($query)
    {
        return $query->whereIn('role', [self::ROLE_STAFF, self::ROLE_CONTENT_CREATOR]);
    }

    public function scopeTeachers($query)
    {
        return $query->where('role', self::ROLE_TEACHER);
    }

    public function scopeStudents($query)
    {
        return $query->where('role', self::ROLE_USER);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function isAdmin()
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isStaff()
    {
        return in_array($this->role, [self::ROLE_STAFF, self::ROLE_CONTENT_CREATOR], true);
    }

    public function isTeacher()
    {
        return $this->role === self::ROLE_TEACHER;
    }

    public function isStudent()
    {
        return $this->role === self::ROLE_USER;
    }

   public function isVerifiedTeacher()
{
    return $this->isTeacher() && ! is_null($this->verified_at);
}

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isPendingVerification(): bool
    {
        return $this->status === 'pending_verification';
    }

    public function hasVerifiedEmail(): bool
    {
        return ! is_null($this->email_verified_at);
    }
}
