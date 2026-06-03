<?php

namespace App\Services;

use App\Models\Certification;
use App\Models\EnrollmentRequest;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class XenditService
{
    public function isConfigured(): bool
    {
        return ! empty(config('xendit.secret_key'));
    }

    /**
     * Create a Xendit invoice and persist the invoice id on the enrollment request.
     *
     * @return array{invoice_id: string, invoice_url: string}
     */
    public function createBulkCheckoutInvoice(
        EnrollmentRequest $enrollmentRequest,
        Certification $certification,
        User $teacher,
    ): array {
        $this->assertConfigured();

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->withBasicAuth(config('xendit.secret_key'), '')
            ->post($this->apiUrl('/v2/invoices'), [
                'external_id' => $enrollmentRequest->payment_reference,
                'amount' => (float) $enrollmentRequest->amount,
                'description' => 'Bulk Certification Vouchers: '.$certification->title,
                'payer_email' => $teacher->email,
                'success_redirect_url' => route('teacher.shop.index', [
                    'payment_reference' => $enrollmentRequest->payment_reference,
                ]),
                'failure_redirect_url' => route('teacher.shop.index'),
                'currency' => 'PHP',
            ]);

        if ($response->failed()) {
            throw new \RuntimeException(
                'Xendit invoice creation failed ('.$response->status().'): '.$response->body()
            );
        }

        $invoice = $response->json();
        $invoiceId = $invoice['id'] ?? null;
        $invoiceUrl = $invoice['invoice_url'] ?? null;

        if (! $invoiceId || ! $invoiceUrl) {
            throw new \RuntimeException('Xendit response did not include invoice id and checkout URL.');
        }

        $enrollmentRequest->update([
            'xendit_invoice_id' => $invoiceId,
        ]);

        return [
            'invoice_id' => $invoiceId,
            'invoice_url' => $invoiceUrl,
        ];
    }

    /**
     * Poll Xendit and provision vouchers when the invoice is paid.
     *
     * @return 'paid'|'pending'|'failed'|'expired'|'unknown'
     */
    public function syncEnrollmentRequestPayment(EnrollmentRequest $enrollmentRequest): string
    {
        if ($enrollmentRequest->status === 'paid') {
            return 'paid';
        }

        if ($enrollmentRequest->request_type !== 'teacher_bulk') {
            return 'unknown';
        }

        $invoice = $this->resolveInvoiceForRequest($enrollmentRequest);
        if (! $invoice) {
            return 'unknown';
        }

        $status = strtoupper((string) ($invoice['status'] ?? ''));

        if ($this->isPaidStatus($status)) {
            app(TeacherVoucherProvisioningService::class)->provisionFromXenditInvoice(
                $enrollmentRequest->fresh(),
                $invoice,
            );

            return 'paid';
        }

        if (in_array($status, ['EXPIRED'], true)) {
            if ($enrollmentRequest->status === 'pending') {
                $enrollmentRequest->update(['status' => 'failed']);
            }

            return 'expired';
        }

        if (in_array($status, ['FAILED'], true)) {
            if ($enrollmentRequest->status === 'pending') {
                $enrollmentRequest->update(['status' => 'failed']);
            }

            return 'failed';
        }

        return 'pending';
    }

    public function handleInvoiceWebhook(array $payload): void
    {
        $invoice = $this->normalizeInvoicePayload($payload);
        $externalId = $invoice['external_id'] ?? null;
        $status = strtoupper((string) ($invoice['status'] ?? ''));

        if (! $externalId || ! $this->isPaidStatus($status)) {
            return;
        }

        $enrollmentRequest = EnrollmentRequest::where('payment_reference', $externalId)
            ->where('request_type', 'teacher_bulk')
            ->first();

        if (! $enrollmentRequest) {
            Log::warning('Xendit webhook: enrollment request not found', ['external_id' => $externalId]);

            return;
        }

        app(TeacherVoucherProvisioningService::class)->provisionFromXenditInvoice(
            $enrollmentRequest,
            $invoice,
        );
    }

    public function webhookTokenMatches(?string $providedToken): bool
    {
        $expected = config('xendit.webhook_token');

        return ! empty($expected) && hash_equals($expected, (string) $providedToken);
    }

    private function resolveInvoiceForRequest(EnrollmentRequest $enrollmentRequest): ?array
    {
        if ($enrollmentRequest->xendit_invoice_id) {
            $invoice = $this->getInvoice($enrollmentRequest->xendit_invoice_id);
            if ($invoice) {
                return $invoice;
            }
        }

        if ($enrollmentRequest->payment_reference) {
            return $this->getInvoiceByExternalId($enrollmentRequest->payment_reference);
        }

        return null;
    }

    public function getInvoice(string $invoiceId): ?array
    {
        $this->assertConfigured();

        $response = Http::withBasicAuth(config('xendit.secret_key'), '')
            ->get($this->apiUrl('/v2/invoices/'.$invoiceId));

        if ($response->failed()) {
            Log::warning('Xendit get invoice failed', [
                'invoice_id' => $invoiceId,
                'status' => $response->status(),
            ]);

            return null;
        }

        return $response->json();
    }

    public function getInvoiceByExternalId(string $externalId): ?array
    {
        $this->assertConfigured();

        $response = Http::withBasicAuth(config('xendit.secret_key'), '')
            ->get($this->apiUrl('/v2/invoices'), [
                'external_id' => $externalId,
            ]);

        if ($response->failed()) {
            Log::warning('Xendit invoice lookup failed', [
                'external_id' => $externalId,
                'status' => $response->status(),
            ]);

            return null;
        }

        $body = $response->json();
        $invoices = $body['data'] ?? $body;

        if (! is_array($invoices) || empty($invoices)) {
            return null;
        }

        return $invoices[0] ?? null;
    }

    private function normalizeInvoicePayload(array $payload): array
    {
        if (isset($payload['data']) && is_array($payload['data'])) {
            return $payload['data'];
        }

        return $payload;
    }

    private function isPaidStatus(string $status): bool
    {
        return in_array($status, ['PAID', 'SETTLED'], true);
    }

    private function apiUrl(string $path): string
    {
        return rtrim(config('xendit.api_base_url'), '/').$path;
    }

    private function assertConfigured(): void
    {
        if (! $this->isConfigured()) {
            throw new \RuntimeException('XENDIT_SECRET_KEY is not configured.');
        }
    }
}
