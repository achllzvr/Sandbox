<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'enrollment_request_id',
        'processed_by',
        'provider',
        'provider_invoice_id',
        'provider_reference',
        'amount',
        'status',
        'method',
        'paid_at',
        'raw_payload',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function enrollmentRequest()
    {
        return $this->belongsTo(EnrollmentRequest::class);
    }
}
