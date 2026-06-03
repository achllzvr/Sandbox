<?php

namespace App\Http\Middleware;

use App\Models\Module;
use App\Services\EnrollmentService;
use Closure;
use Illuminate\Http\Request;

class EnsureEnrolledInCertification
{
    public function __construct(private EnrollmentService $enrollmentService) {}

    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        $certification = $request->route('certification');
        if ($certification) {
            $this->enrollmentService->assertEnrolled($user, (int) $certification->id);

            return $next($request);
        }

        $module = $request->route('module');
        if ($module instanceof Module) {
            $this->enrollmentService->assertEnrolledForModule($user, $module);

            return $next($request);
        }

        return $next($request);
    }
}
