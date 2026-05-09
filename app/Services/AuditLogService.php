<?php

namespace App\Services;

use App\Models\AuditLog;

class AuditLogService {
    public function log(string $action, int $userId, array $details = []) {
        AuditLog::create([
            'user_id' => $userId,
            'action' => $action,
            'details' => $details,
        ]);
    }
}

