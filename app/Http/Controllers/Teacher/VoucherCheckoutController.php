<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\VoucherPurchaseRequest;
use App\Models\Certification;
use App\Models\EnrollmentRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class VoucherCheckoutController extends Controller
{
    /**
     * Store a new bulk voucher purchase request and redirect to Xendit.
     *
     * @param  \App\Http\Requests\Teacher\VoucherPurchaseRequest  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(VoucherPurchaseRequest $request)
    {
        // 1. Resolve the target Certification model to grab its current 'price'
        $certification = Certification::findOrFail($request->certification_id);

        // 2. Calculate the total cost: price * quantity
        $totalCost = $certification->price * $request->quantity;

        // 3. Generate a secure, unique payment reference string prefixed with 'SBX-TCH-'
        $paymentReference = 'SBX-TCH-' . strtoupper(Str::random(12));

        // 4. Save the base transaction state in 'enrollment_requests' using lowercase string values
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
            // 5. Initialize the Xendit Invoice SDK/API payload
            $apiKey = env('XENDIT_SECRET_KEY');
            if (empty($apiKey)) {
                throw new \Exception('Xendit secret key is not configured in the environment.');
            }

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->withBasicAuth($apiKey, '')
            ->post('https://api.xendit.co/v2/invoices', [
                'external_id' => $paymentReference,
                'amount' => (double) $totalCost,
                'description' => 'Bulk Certification Vouchers: ' . $certification->title,
                'payer_email' => auth()->user()->email,
                'success_redirect_url' => route('teacher.vouchers'),
                'failure_redirect_url' => route('teacher.purchasing'),
            ]);

            if ($response->failed()) {
                throw new \Exception('Xendit API returned failure status: ' . $response->status() . ' - ' . $response->body());
            }

            $invoice = $response->json();
            $checkoutUrl = $invoice['invoice_url'] ?? null;

            if (empty($checkoutUrl)) {
                throw new \Exception('Xendit response was successful but did not contain an invoice_url.');
            }

            // 6. Return Inertia::location to execute full-window redirect
            return \Inertia\Inertia::location($checkoutUrl);

        } catch (\Exception $e) {
            // 7. Error handling: catch, log, update status to failed, redirect back with errors
            Log::error('Xendit Bulk Checkout API Exception: ' . $e->getMessage(), [
                'enrollment_request_id' => $enrollmentRequest->id,
                'payment_reference' => $paymentReference,
                'trace' => $e->getTraceAsString(),
            ]);

            $enrollmentRequest->update([
                'status' => 'failed',
            ]);

            return redirect()->back()->withErrors([
                'checkout' => 'Failed to connect to payment gateway. Please try again later. (' . $e->getMessage() . ')'
            ]);
        }
    }
}
