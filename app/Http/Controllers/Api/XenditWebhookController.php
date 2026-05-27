<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cohort;
use App\Models\EnrollmentRequest;
use App\Models\Payment;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class XenditWebhookController extends Controller
{
    /**
     * Handle inbound stateless webhook payload from Xendit.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handle(Request $request)
    {
        // 1. Validate x-callback-token
        $callbackToken = $request->header('x-callback-token');
        $expectedToken = env('XENDIT_WEBHOOK_TOKEN');

        if (empty($expectedToken) || $callbackToken !== $expectedToken) {
            Log::warning('Xendit Webhook Warning: Unauthorized request attempted.', [
                'received_token' => $callbackToken,
                'ip' => $request->ip(),
            ]);
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // 2. Perform strict lookup for the enrollment request via payment_reference (Xendit external_id)
        $paymentReference = $request->input('external_id');
        if (empty($paymentReference)) {
            return response()->json(['error' => 'Missing external_id'], 400);
        }

        $enrollmentRequest = EnrollmentRequest::where('payment_reference', $paymentReference)->first();

        if (!$enrollmentRequest) {
            Log::error('Xendit Webhook Error: Corresponding enrollment request not found.', [
                'external_id' => $paymentReference,
            ]);
            return response()->json(['error' => 'Enrollment request not found'], 404);
        }

        // 3. Idempotency Guard
        if ($enrollmentRequest->status === 'paid') {
            return response()->json(['status' => 'already_processed'], 200);
        }

        $xenditStatus = strtoupper($request->input('status', ''));

        // 4. Evaluate status PAID
        if ($xenditStatus === 'PAID') {
            try {
                DB::transaction(function () use ($enrollmentRequest, $request) {
                    $paymentMethod = $request->input('payment_method', 'XENDIT');

                    // A. Update enrollment request status to paid
                    $enrollmentRequest->update([
                        'status' => 'paid',
                        'payment_method' => $paymentMethod,
                        'reviewed_at' => now(),
                    ]);

                    // B. Log into the payments table
                    Payment::create([
                        'enrollment_request_id' => $enrollmentRequest->id,
                        'provider' => 'xendit',
                        'provider_invoice_id' => $request->input('id'),
                        'provider_reference' => $request->input('payment_id') ?? $request->input('payment_reference'),
                        'amount' => $enrollmentRequest->amount,
                        'status' => 'paid',
                        'method' => $paymentMethod,
                        'paid_at' => now(),
                        'raw_payload' => json_encode($request->all()),
                    ]);

                    // C. Auto-provision a cohort class record
                    $cohortName = 'Batch ' . date('M j, Y');
                    $cohort = Cohort::create([
                        'teacher_id' => $enrollmentRequest->user_id,
                        'certification_id' => $enrollmentRequest->certification_id,
                        'cohort_name' => $cohortName,
                    ]);

                    // D. Loop to generate the randomized unique bulk vouchers
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

                    // E. Multi-row insertion for query efficiency
                    Voucher::insert($vouchers);
                });

                Log::info('Xendit Webhook Success: Paid and processed bulk vouchers successfully.', [
                    'payment_reference' => $paymentReference,
                    'quantity' => $enrollmentRequest->quantity,
                ]);

            } catch (\Exception $e) {
                Log::error('Xendit Webhook DB Processing Failure: ' . $e->getMessage(), [
                    'payment_reference' => $paymentReference,
                    'trace' => $e->getTraceAsString(),
                ]);
                return response()->json(['error' => 'Internal Processing Error'], 500);
            }
        } elseif ($xenditStatus === 'EXPIRED' || $xenditStatus === 'FAILED') {
            // 5. Handle expired/failed webhook signals
            $enrollmentRequest->update([
                'status' => 'failed',
            ]);

            Log::info('Xendit Webhook Status Downgrade: Enrollment updated to failed.', [
                'payment_reference' => $paymentReference,
                'status' => $xenditStatus,
            ]);
        }

        // 6. Return 200 OK
        return response()->json(['status' => 'success'], 200);
    }
}
