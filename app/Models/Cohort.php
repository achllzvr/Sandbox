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

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function certification()
    {
        return $this->belongsTo(Certification::class);
    }

    public function vouchers()
    {
        return $this->hasMany(Voucher::class);
    }
}
