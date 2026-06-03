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
        $filters = $request->only(['search', 'action', 'date_from', 'date_to']);
        $isMock = true;

        $emptyPaginator = AuditLog::query()->whereRaw('0 = 1')->paginate(15)->withQueryString();

        if (! Schema::hasTable('audit_logs')) {
            return Inertia::render('Admin/AuditLogs/Index', [
                'logs' => $emptyPaginator,
                'is_mock' => $isMock,
                'filters' => $filters,
            ]);
        }

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

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->paginate(15)->withQueryString();
        $isMock = $logs->total() === 0;

        $logs->through(fn (AuditLog $log) => [
            'id' => $log->id,
            'action' => $log->action,
            'created_at' => $log->created_at,
            'details_summary' => is_array($log->details)
                ? ($log->details['summary'] ?? json_encode($log->details))
                : $log->details,
            'user' => $log->user,
        ]);

        return Inertia::render('Admin/AuditLogs/Index', [
            'logs' => $logs,
            'is_mock' => $isMock,
            'filters' => $filters,
        ]);
    }
}
