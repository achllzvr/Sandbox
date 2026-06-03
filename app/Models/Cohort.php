<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cohort extends Model
{
    protected $fillable = [
        'teacher_id',
        'certification_id',
        'cohort_name',
    ];

    public function students()
    {
        return $this->belongsToMany(User::class, 'cohort_students', 'cohort_id', 'user_id')
            ->withPivot('voucher_id', 'joined_at');
    }
}
