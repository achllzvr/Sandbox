<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index()
    {
        // Placeholder — will be populated when audit_logs table is provided
        return Inertia::render('Admin/AuditLogs/Index', [
            'logs' => [],
        ]);
    }
}
