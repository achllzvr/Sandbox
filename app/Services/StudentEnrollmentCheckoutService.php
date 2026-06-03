<?php

namespace App\Services;

use App\Models\Certification;
use App\Models\Enrollment;
use App\Models\EnrollmentRequest;
use App\Models\User;
use App\Support\CheckoutTotals;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class StudentEnrollmentCheckoutService
{
    public function __construct(
        private XenditService $xenditService,
        private StudentDirectPurchaseProvisioningService $provisioningService,
    ) {
    }

    public function checkout(User $student, Certification $certification, float $expectedTotal): RedirectResponse
    {
        if (Enrollment::where('user_id', $student->id)
            ->where('certification_id', $certification->id)
            ->where('status', 'active')
            ->exists()) {
            return redirect()
                ->route('marketplace.index')
                ->with('error', 'You are already enrolled in this shell.');
        }

        $totalCost = CheckoutTotals::compute($certification, 1);

        if (! CheckoutTotals::matchesExpected($expectedTotal, $totalCost)) {
            return $this->checkoutError('Checkout total does not match the shell price. Refresh and try again.');
        }

        $paymentReference = 'SBX-STU-'.strtoupper(Str::random(12));

        $enrollmentRequest = EnrollmentRequest::create([
            'user_id' => $student->id,
            'certification_id' => $certification->id,
            'request_type' => 'direct_purchase',
            'quantity' => 1,
            'amount' => $totalCost,
            'status' => 'pending',
            'payment_reference' => $paymentReference,
            'requested_at' => now(),
        ]);

        try {
            if ($totalCost <= 0) {
                return $this->completeFreeCheckout($enrollmentRequest, $certification);
            }

            if (! $this->xenditService->isConfigured()) {
                $this->markCheckoutFailed($enrollmentRequest);

                return $this->checkoutError(
                    'Payment gateway is not configured. Add XENDIT_SECRET_KEY (test key) to your .env file.'
                );
            }

            $invoice = $this->xenditService->createDirectPurchaseInvoice(
                $enrollmentRequest,
                $certification,
                $student,
            );

            return redirect()
                ->route('marketplace.index')
                ->with('xendit_checkout_url', $invoice['invoice_url']);
        } catch (\Throwable $e) {
            Log::error('Student enrollment checkout failed: '.$e->getMessage(), [
                'enrollment_request_id' => $enrollmentRequest->id,
                'payment_reference' => $paymentReference,
                'certification_id' => $certification->id,
                'amount' => $totalCost,
            ]);

            $this->markCheckoutFailed($enrollmentRequest);

            $message = $totalCost <= 0
                ? 'Could not complete enrollment. Please try again or contact support.'
                : 'Could not start Xendit checkout. Check your test API key and try again.';

            return $this->checkoutError($message);
        }
    }

    private function completeFreeCheckout(
        EnrollmentRequest $enrollmentRequest,
        Certification $certification,
    ): RedirectResponse {
        $this->provisioningService->provisionFromXenditInvoice($enrollmentRequest, [
            'id' => 'free-'.$enrollmentRequest->payment_reference,
            'external_id' => $enrollmentRequest->payment_reference,
            'status' => 'PAID',
            'amount' => 0,
            'payment_method' => 'FREE_ENROLLMENT',
        ]);

        return redirect()
            ->route('marketplace.index')
            ->with('shop_success', $certification->id)
            ->with('success', 'You are enrolled. Start learning in My Shells.');
    }

    private function markCheckoutFailed(EnrollmentRequest $enrollmentRequest): void
    {
        if ($enrollmentRequest->status === 'pending') {
            $enrollmentRequest->update(['status' => 'failed']);
        }
    }

    private function checkoutError(string $message): RedirectResponse
    {
        return redirect()
            ->back()
            ->withErrors(['checkout' => $message])
            ->with('error', $message);
    }
}
