<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\VoucherPurchaseRequest;
use App\Models\Certification;
use App\Models\EnrollmentRequest;
use App\Services\TeacherVoucherProvisioningService;
use App\Services\XenditService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class VoucherCheckoutController extends Controller
{
    public function __construct(
        private XenditService $xenditService,
        private TeacherVoucherProvisioningService $provisioningService,
    ) {}

    public function store(VoucherPurchaseRequest $request)
    {
        $certification = Certification::findOrFail($request->certification_id);
        $totalCost = round((float) $certification->price * (int) $request->quantity, 2);
        $paymentReference = 'SBX-TCH-'.strtoupper(Str::random(12));

        $enrollmentRequest = EnrollmentRequest::create([
            'user_id' => auth()->id(),
            'certification_id' => $certification->id,
            'request_type' => 'teacher_bulk',
            'quantity' => $request->quantity,
            'amount' => $totalCost,
            'status' => 'pending',
            'payment_reference' => $paymentReference,
            'requested_at' => now(),
        ]);

        try {
            if ($totalCost <= 0) {
                return $this->completeFreeCheckout($enrollmentRequest, $certification, $request->quantity);
            }

            if (! $this->xenditService->isConfigured()) {
                $this->markCheckoutFailed($enrollmentRequest);

                return $this->checkoutError(
                    'Payment gateway is not configured. Add XENDIT_SECRET_KEY (test key) to your .env file.'
                );
            }

            $invoice = $this->xenditService->createBulkCheckoutInvoice(
                $enrollmentRequest,
                $certification,
                $request->user(),
            );

            return redirect()
                ->route('teacher.shop.index')
                ->with('xendit_checkout_url', $invoice['invoice_url']);
        } catch (\Throwable $e) {
            Log::error('Teacher bulk checkout failed: '.$e->getMessage(), [
                'enrollment_request_id' => $enrollmentRequest->id,
                'payment_reference' => $paymentReference,
                'certification_id' => $certification->id,
                'amount' => $totalCost,
            ]);

            $this->markCheckoutFailed($enrollmentRequest);

            $message = $totalCost <= 0
                ? 'Could not create voucher batch. Please try again or contact support.'
                : 'Could not start Xendit checkout. Check your test API key and try again.';

            return $this->checkoutError($message);
        }
    }

    private function completeFreeCheckout(
        EnrollmentRequest $enrollmentRequest,
        Certification $certification,
        int $quantity,
    ) {
        $this->provisioningService->provisionFromXenditInvoice($enrollmentRequest, [
            'id' => 'free-'.$enrollmentRequest->payment_reference,
            'external_id' => $enrollmentRequest->payment_reference,
            'status' => 'PAID',
            'amount' => 0,
            'payment_method' => 'FREE_BATCH',
        ]);

        return redirect()
            ->route('teacher.shop.index')
            ->with('teacher_purchase_success', [
                'certification_id' => $certification->id,
                'quantity' => $quantity,
            ])
            ->with('success', "Voucher batch created. {$quantity} codes are ready in My Shells.");
    }

    private function markCheckoutFailed(EnrollmentRequest $enrollmentRequest): void
    {
        if ($enrollmentRequest->status === 'pending') {
            $enrollmentRequest->update(['status' => 'failed']);
        }
    }

    private function checkoutError(string $message)
    {
        return redirect()
            ->back()
            ->withErrors(['checkout' => $message])
            ->with('error', $message);
    }
}
