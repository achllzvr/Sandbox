// TODO[backend]: Replace all exports below with live API responses from FinanceController / WithdrawalController.

export const MOCK_LEDGER_METRICS = {
    gross_volume: 5000,
    platform_net_profit: 1500,
    total_creator_earnings: 3500,
    pending_payouts: 1,
};

export const MOCK_WEBHOOK_METRICS = {
    sales_24h: 100,
    vouchers_issued: 2,
    failures: 1,
};

export const MOCK_MASTER_LEDGER = [
    {
        id: 1,
        timestamp: '2026-05-19T08:00:00',
        transaction_id: 'T6R2NY8901U8',
        item_sold: 'React Basics',
        creator: 'Meta',
        gross_amount: 1500,
        platform_cut: 450,
        creator_cut: 1050,
    },
    {
        id: 2,
        timestamp: '2026-05-18T14:30:00',
        transaction_id: 'T8K4PL2219V2',
        item_sold: 'Laravel Basics',
        creator: 'LLC',
        gross_amount: 1200,
        platform_cut: 360,
        creator_cut: 840,
    },
];

export const MOCK_WITHDRAWALS = [
    {
        id: 1,
        timestamp: '2026-05-19T08:00:00',
        creator_name: 'John Doe',
        requested_amount: 2500,
        payment_method: 'GCash',
        payment_detail: '09123456789',
        status: 'pending',
    },
    {
        id: 2,
        timestamp: '2026-05-17T11:15:00',
        creator_name: 'Jane Smith',
        requested_amount: 1800,
        payment_method: 'GCash',
        payment_detail: '09987654321',
        status: 'processing',
    },
    {
        id: 3,
        timestamp: '2026-05-15T09:45:00',
        creator_name: 'Alex Cruz',
        requested_amount: 3200,
        payment_method: 'GCash',
        payment_detail: '09112233445',
        status: 'paid',
    },
];

export const MOCK_WEBHOOK_EVENTS = [
    {
        id: 1,
        timestamp: '2026-05-19T08:00:00',
        transaction_id: 'WH-9021-AF',
        user_name: 'John Doe',
        user_email: 'john@example.com',
        item_purchased: 'React Basics',
        amount: 1500,
        voucher: 'HERMIT-20OFF',
        status: 'success',
    },
    {
        id: 2,
        timestamp: '2026-05-18T16:20:00',
        transaction_id: 'WH-8812-BE',
        user_name: 'Maria Santos',
        user_email: 'maria@example.com',
        item_purchased: 'Laravel Basics',
        amount: 1200,
        voucher: null,
        status: 'failed',
    },
];

// TODO[backend]: Replace with AuditLogController when audit_logs table is populated.
export const MOCK_AUDIT_LOGS = [
    {
        id: 1,
        action: 'Created new admin user',
        done_by: 'John Doe',
        created_at: '2026-05-11T08:00:00',
        details_summary: 'Invited admin@example.com',
        severity: 'active',
    },
    {
        id: 2,
        action: 'Published certification',
        done_by: 'Jane Smith',
        created_at: '2026-05-10T15:30:00',
        details_summary: 'React Basics shell approved',
        severity: 'published',
    },
    {
        id: 3,
        action: 'Declined teacher verification',
        done_by: 'John Doe',
        created_at: '2026-05-09T10:12:00',
        details_summary: 'Missing credential documents',
        severity: 'denied',
    },
];

export const AUDIT_ACTION_OPTIONS = [
    { value: '', label: 'All actions' },
    { value: 'user', label: 'User management' },
    { value: 'certification', label: 'Certifications' },
    { value: 'finance', label: 'Finance' },
    { value: 'auth', label: 'Authentication' },
];

export const WITHDRAWAL_STATUS_OPTIONS = [
    { value: '', label: 'All statuses' },
    { value: 'pending', label: 'Pending approval' },
    { value: 'processing', label: 'Processing' },
    { value: 'paid', label: 'Paid' },
];

export const WEBHOOK_STATUS_OPTIONS = [
    { value: '', label: 'All statuses' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
    { value: 'pending', label: 'Pending' },
];

export function formatCurrency(amount) {
    return `₱${Number(amount).toLocaleString('en-PH')}`;
}

export function formatFinanceTimestamp(iso) {
    return new Date(iso).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}
