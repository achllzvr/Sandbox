<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\VoucherPurchaseRequest;
use App\Models\Certification;
use App\Models\EnrollmentRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\Cohort;
use App\Models\Voucher;
use App\Models\Payment;

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

    /**
     * Simulate payment success for a pending bulk request (only in local sandbox context).
     *
     * @param  \App\Models\EnrollmentRequest  $enrollmentRequest
     * @return \Illuminate\Http\RedirectResponse
     */
    public function simulateSuccess(EnrollmentRequest $enrollmentRequest)
    {
        // 1. Authorization guard: must belong to current authenticated user
        if ($enrollmentRequest->user_id !== auth()->id() || auth()->user()->role !== 'teacher') {
            abort(403, 'Unauthorized action.');
        }

        // 2. Guard: Must be pending and teacher_bulk
        if ($enrollmentRequest->status !== 'pending' || $enrollmentRequest->request_type !== 'teacher_bulk') {
            return redirect()->back()->withErrors([
                'simulation' => 'This request cannot be simulated because it is not a pending bulk request.'
            ]);
        }

        try {
            DB::transaction(function () use ($enrollmentRequest) {
                // A. Update status
                $enrollmentRequest->update([
                    'status' => 'paid',
                    'payment_method' => 'SIMULATED',
                    'reviewed_at' => now(),
                ]);

                // B. Create simulated payment
                Payment::create([
                    'enrollment_request_id' => $enrollmentRequest->id,
                    'provider' => 'simulated',
                    'provider_invoice_id' => 'sim_inv_' . Str::random(10),
                    'provider_reference' => 'sim_ref_' . Str::random(10),
                    'amount' => $enrollmentRequest->amount,
                    'status' => 'paid',
                    'method' => 'SIMULATED',
                    'paid_at' => now(),
                    'raw_payload' => json_encode(['simulated' => true]),
                ]);

                // C. Auto-provision a cohort class record
                $cohortName = 'Batch ' . date('M j, Y') . ' (Simulated)';
                $cohort = Cohort::create([
                    'teacher_id' => $enrollmentRequest->user_id,
                    'certification_id' => $enrollmentRequest->certification_id,
                    'cohort_name' => $cohortName,
                ]);

                // D. Generate randomized unique bulk vouchers
                $vouchers = [];
                for ($i = 0; $i < $enrollmentRequest->quantity; $i++) {
                    $code = 'TCH-' . strtoupper(Str::random(10));
                    $vouchers[] = [
                        'enrollment_request_id' => $enrollmentRequest->id,
                        'teacher_id' => $enrollmentRequest->user_id,
                        'cohort_id' => $cohort->id,
                        'certification_id' => $enrollmentRequest->certification_id,
                        'code' => $code,
                        'is_used' => 0,
                        'issued_at' => now(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                Voucher::insert($vouchers);
            });

            return redirect()->route('teacher.dashboard')->with('success', "Payment simulated successfully! Generated {$enrollmentRequest->quantity} vouchers.");

        } catch (\Exception $e) {
            Log::error('Simulation Checkout Payment Failure: ' . $e->getMessage(), [
                'enrollment_request_id' => $enrollmentRequest->id,
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->withErrors([
                'simulation' => 'Failed to simulate payment completion: ' . $e->getMessage()
            ]);
        }
    }
}
