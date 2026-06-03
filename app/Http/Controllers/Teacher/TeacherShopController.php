<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\EnrollmentRequest;
use App\Models\Voucher;
use App\Services\XenditService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherShopController extends Controller
{
    public function __construct(private XenditService $xenditService) {}

    public function index(Request $request)
    {
        $this->syncPaymentReturn($request);

        $search = trim((string) $request->input('search', ''));
        $category = (string) $request->input('category', 'all');
        $sort = (string) $request->input('sort', 'price-asc');

        if (! in_array($sort, ['price-asc', 'price-desc'], true)) {
            $sort = 'price-asc';
        }

        $query = Certification::query()
            ->whereIn('status', ['approved', 'published'])
            ->with('creator:id,first_name,last_name');

        if ($search !== '') {
            $like = '%'.$this->escapeLike($search).'%';

            $query->where(function ($builder) use ($like) {
                $builder->where('title', 'like', $like)
                    ->orWhere('description', 'like', $like)
                    ->orWhere('category', 'like', $like)
                    ->orWhere('tags', 'like', $like);
            });
        }

        if ($category !== '' && $category !== 'all') {
            $like = '%'.$this->escapeLike($category).'%';

            $query->where(function ($builder) use ($like) {
                $builder->where('category', 'like', $like)
                    ->orWhere('title', 'like', $like)
                    ->orWhere('tags', 'like', $like);
            });
        }

        $query->orderBy('price', $sort === 'price-desc' ? 'desc' : 'asc')
            ->orderBy('title');

        $certifications = $query->paginate(12)->withQueryString();

        $categories = Certification::query()
            ->whereIn('status', ['approved', 'published'])
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->values();

        $teacherId = auth()->id();

        $purchasedCertificationIds = Voucher::where('teacher_id', $teacherId)
            ->pluck('certification_id')
            ->unique()
            ->values()
            ->all();

        $pendingPurchases = EnrollmentRequest::with(['certification'])
            ->where('user_id', $teacherId)
            ->where('request_type', 'teacher_bulk')
            ->where('status', 'pending')
            ->orderByDesc('requested_at')
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'shell_title' => $order->certification->title ?? 'N/A',
                'quantity' => $order->quantity,
                'amount' => (float) $order->amount,
                'payment_reference' => $order->payment_reference,
                'requested_at' => $order->requested_at
                    ? $order->requested_at->format('M d, Y; g:ia')
                    : 'N/A',
            ]);

        return Inertia::render('Teacher/Shop/Index', [
            'certifications' => $certifications,
            'filters' => [
                'search' => $search,
                'category' => $category !== '' ? $category : 'all',
                'sort' => $sort,
            ],
            'categories' => $categories,
            'purchasedCertificationIds' => $purchasedCertificationIds,
            'pendingPurchases' => $pendingPurchases,
        ]);
    }

    private function syncPaymentReturn(Request $request): void
    {
        if (! $request->filled('payment_reference') || ! $this->xenditService->isConfigured()) {
            return;
        }

        $enrollmentRequest = EnrollmentRequest::where('payment_reference', $request->payment_reference)
            ->where('user_id', auth()->id())
            ->where('request_type', 'teacher_bulk')
            ->first();

        if (! $enrollmentRequest) {
            return;
        }

        $syncStatus = $this->xenditService->syncEnrollmentRequestPayment($enrollmentRequest);

        if ($syncStatus === 'paid') {
            session()->flash(
                'teacher_purchase_success',
                [
                    'certification_id' => $enrollmentRequest->certification_id,
                    'quantity' => $enrollmentRequest->quantity,
                ],
            );
            session()->flash(
                'success',
                "Payment confirmed via Xendit. {$enrollmentRequest->quantity} voucher codes are ready in My Shells.",
            );
        } elseif ($syncStatus === 'pending') {
            session()->flash(
                'error',
                'Xendit is still processing this payment. Wait a few seconds and refresh, or complete checkout in test mode.',
            );
        } elseif ($syncStatus === 'failed' || $syncStatus === 'expired') {
            session()->flash('error', 'This checkout did not complete. Start a new purchase from the shop.');
        }
    }

    private function escapeLike(string $value): string
    {
        return addcslashes($value, '%_\\');
    }
}
