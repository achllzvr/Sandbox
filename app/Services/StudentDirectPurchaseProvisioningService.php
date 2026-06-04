<?php

namespace App\Services;

use App\Models\Enrollment;
use App\Models\EnrollmentRequest;
use App\Models\Payment;

class StudentDirectPurchaseProvisioningService
{
    public function provisionFromXenditInvoice(EnrollmentRequest $enrollmentRequest, array $invoice): void
    {
        if ($enrollmentRequest->request_type !== 'direct_purchase') {
            throw new \InvalidArgumentException('Enrollment request is not a direct purchase.');
        }

        if ($enrollmentRequest->status === 'paid') {
            return;
        }

        $paymentMethod = $invoice['payment_method']
            ?? ($invoice['payment_channel'] ?? null)
            ?? ($invoice['available_banks'][0]['bank_code'] ?? null);

        $this->provisionPaidDirectPurchase($enrollmentRequest, [
            'provider' => 'xendit',
            'provider_invoice_id' => $invoice['id'] ?? $enrollmentRequest->xendit_invoice_id,
            'provider_reference' => $invoice['payment_id'] ?? null,
            'amount' => $invoice['amount'] ?? $enrollmentRequest->amount,
            'method' => $paymentMethod,
            'raw_payload' => $invoice,
        ]);
    }

    public function provisionPaidDirectPurchase(
        EnrollmentRequest $enrollmentRequest,
        array $paymentAttributes,
    ): void {
        if ($enrollmentRequest->request_type !== 'direct_purchase') {
            throw new \InvalidArgumentException('Enrollment request is not a direct purchase.');
        }

        if ($enrollmentRequest->status === 'paid') {
            return;
        }

        $enrollmentRequest->update([
            'status' => 'paid',
            'payment_method' => $paymentAttributes['method'] ?? null,
            'reviewed_at' => now(),
            'xendit_invoice_id' => $paymentAttributes['provider_invoice_id'] ?? $enrollmentRequest->xendit_invoice_id,
        ]);

        $payment = Payment::create([
            'enrollment_request_id' => $enrollmentRequest->id,
            'provider' => $paymentAttributes['provider'] ?? 'xendit',
            'provider_invoice_id' => $paymentAttributes['provider_invoice_id'] ?? null,
            'provider_reference' => $paymentAttributes['provider_reference'] ?? null,
            'amount' => $paymentAttributes['amount'] ?? $enrollmentRequest->amount,
            'status' => 'paid',
            'method' => $paymentAttributes['method'] ?? null,
            'paid_at' => now(),
            'raw_payload' => isset($paymentAttributes['raw_payload'])
                ? (is_string($paymentAttributes['raw_payload']) ? $paymentAttributes['raw_payload'] : json_encode($paymentAttributes['raw_payload']))
                : null,
        ]);

        app(CreatorEarningService::class)->recordForPayment($payment);

        Enrollment::firstOrCreate(
            [
                'user_id' => $enrollmentRequest->user_id,
                'certification_id' => $enrollmentRequest->certification_id,
            ],
            [
                'enrollment_request_id' => $enrollmentRequest->id,
                'access_type' => 'direct_purchase',
                'status' => 'active',
                'enrolled_at' => now(),
            ],
        );
    }
}
