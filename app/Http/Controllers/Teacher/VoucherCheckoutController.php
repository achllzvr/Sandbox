<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\VoucherPurchaseRequest;
use App\Models\Certification;
use App\Models\EnrollmentRequest;
use App\Services\XenditService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class VoucherCheckoutController extends Controller
{
    public function __construct(private XenditService $xenditService) {}

    public function store(VoucherPurchaseRequest $request)
    {
        if (! $this->xenditService->isConfigured()) {
            return redirect()->back()->withErrors([
                'checkout' => 'Payment gateway is not configured. Add XENDIT_SECRET_KEY (test key) to your .env file.',
            ]);
        }

        $certification = Certification::findOrFail($request->certification_id);
        $totalCost = $certification->price * $request->quantity;
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
            $invoice = $this->xenditService->createBulkCheckoutInvoice(
                $enrollmentRequest,
                $certification,
                $request->user(),
            );

            return Inertia::location($invoice['invoice_url']);
        } catch (\Throwable $e) {
            Log::error('Xendit bulk checkout failed: '.$e->getMessage(), [
                'enrollment_request_id' => $enrollmentRequest->id,
                'payment_reference' => $paymentReference,
            ]);

            $enrollmentRequest->update(['status' => 'failed']);

            return redirect()->back()->withErrors([
                'checkout' => 'Could not start Xendit checkout. Check your test API key and try again.',
            ]);
        }
    }
}
