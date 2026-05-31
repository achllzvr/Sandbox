<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        // TODO[backend]: Add date_from/date_to filters, pagination, and audit log creation on admin mutations.
        $filters = $request->only(['search', 'action']);
        $isMock = true;
        $logs = [];

        if (Schema::hasTable('audit_logs')) {
            $query = AuditLog::with('user:id,first_name,last_name,email')->latest();

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('action', 'like', "%{$search}%")
                        ->orWhere('details', 'like', "%{$search}%");
                });
            }

            if ($request->filled('action')) {
                $query->where('action', 'like', "%{$request->action}%");
            }

            $records = $query->limit(50)->get();

            if ($records->isNotEmpty()) {
                $isMock = false;
                $logs = $records->map(fn (AuditLog $log) => [
                    'id' => $log->id,
                    'action' => $log->action,
                    'created_at' => $log->created_at,
                    'details_summary' => is_array($log->details)
                        ? ($log->details['summary'] ?? json_encode($log->details))
                        : $log->details,
                    'user' => $log->user,
                ]);
            }
        }

        return Inertia::render('Admin/AuditLogs/Index', [
            'logs' => $logs,
            'is_mock' => $isMock,
            'filters' => $filters,
        ]);
    }
}
