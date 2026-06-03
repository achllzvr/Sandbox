<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Cohort;
use App\Models\EnrollmentRequest;
use App\Models\Voucher;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TeacherShellController extends Controller
{
    public function index()
    {
        $teacherId = auth()->id();

        $certIds = Voucher::where('teacher_id', $teacherId)->pluck('certification_id')->unique();
        $shells = Certification::whereIn('id', $certIds)
            ->get()
            ->map(fn (Certification $cert) => $this->formatShellCard($cert));

        return Inertia::render('Teacher/Shells/Index', [
            'shells' => $shells,
            'purchaseHistory' => $this->purchaseHistoryForTeacher($teacherId),
            'isMock' => false,
        ]);
    }

    public function show(int $certification)
    {
        $teacherId = auth()->id();
        $cert = Certification::findOrFail($certification);

        $owns = Voucher::where('teacher_id', $teacherId)->where('certification_id', $certification)->exists();
        if (! $owns) {
            abort(403);
        }

        $cohorts = Cohort::where('teacher_id', $teacherId)
            ->where('certification_id', $certification)
            ->orderByDesc('created_at')
            ->get();

        $batches = $cohorts->map(fn (Cohort $cohort) => [
            'id' => $cohort->id,
            'label' => $cohort->cohort_name ?? 'Batch '.$cohort->created_at->format('M j, Y'),
        ])->values();

        $voucherGroups = $cohorts->map(function (Cohort $cohort) use ($teacherId, $certification) {
            $vouchers = Voucher::with('usedByUser')
                ->where('teacher_id', $teacherId)
                ->where('certification_id', $certification)
                ->where('cohort_id', $cohort->id)
                ->orderByDesc('created_at')
                ->get()
                ->map(function (Voucher $voucher) {
                    $student = $voucher->usedByUser;

                    return [
                        'id' => $voucher->id,
                        'code' => $voucher->code,
                        'status' => $voucher->is_used ? 'claimed' : 'unclaimed',
                        'student_name' => $student ? trim($student->first_name.' '.$student->last_name) : null,
                        'student_email' => $student?->email,
                        'updated_at' => $voucher->used_at?->format('M d, Y; g:ia')
                            ?? $voucher->updated_at?->format('M d, Y; g:ia'),
                        'email_status' => $voucher->is_used ? null : 'sendable',
                    ];
                });

            return [
                'batch_id' => $cohort->id,
                'batch_label' => 'Bought on '.$cohort->created_at->format('M j, Y'),
                'vouchers' => $vouchers->values()->all(),
            ];
        })->filter(fn (array $group) => count($group['vouchers']) > 0)->values();

        return Inertia::render('Teacher/Shells/Show', [
            'certification' => $cert,
            'batches' => $batches,
            'voucherGroups' => $voucherGroups,
            'purchaseHistory' => $this->purchaseHistoryForTeacher($teacherId, $certification),
            'isMock' => false,
        ]);
    }

    public function batch(int $certification, int $cohort)
    {
        $teacherId = auth()->id();
        $cert = Certification::findOrFail($certification);
        $batch = Cohort::where('id', $cohort)->where('teacher_id', $teacherId)->firstOrFail();

        $studentIds = DB::table('cohort_students')->where('cohort_id', $cohort)->pluck('user_id');
        $completed = DB::table('user_module_progress')
            ->whereIn('user_id', $studentIds)
            ->where('is_completed', true)
            ->count();

        return Inertia::render('Teacher/Shells/Batch', [
            'certification' => $cert,
            'analytics' => [
                'cohort_name' => $batch->cohort_name,
                'students' => $studentIds->count(),
                'completed_modules' => $completed,
            ],
            'isMock' => false,
        ]);
    }

    private function formatShellCard(Certification $cert): array
    {
        return [
            'id' => $cert->id,
            'title' => $cert->title,
            'cover_image' => $cert->thumbnail_url,
            'badge_type' => 'pro',
            'badge_label' => 'Professional Certificate',
        ];
    }

    private function purchaseHistoryForTeacher(int $teacherId, ?int $certificationId = null): array
    {
        $query = EnrollmentRequest::with(['certification'])
            ->where('user_id', $teacherId)
            ->where('request_type', 'teacher_bulk')
            ->where('status', 'paid');

        if ($certificationId) {
            $query->where('certification_id', $certificationId);
        }

        return $query->orderByDesc('reviewed_at')
            ->limit(20)
            ->get()
            ->map(function (EnrollmentRequest $request) {
                $cohort = Voucher::where('enrollment_request_id', $request->id)->first()?->cohort;

                return [
                    'id' => $request->id,
                    'purchased_at' => $request->reviewed_at?->format('M d, Y') ?? '—',
                    'shell_title' => $request->certification->title ?? 'N/A',
                    'batch_label' => $cohort?->cohort_name ?? 'Batch',
                    'quantity' => $request->quantity,
                    'amount' => (float) $request->amount,
                ];
            })
            ->all();
    }
}
