<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnrollmentRequest extends Model
{
    protected $table = 'enrollment_requests';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'certification_id',
        'status',
        'payment_proof_url',
        'payment_reference',
        'requested_at',
        'reviewed_at',
        'reviewed_by',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function certification()
    {
        return $this->belongsTo(Certification::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}