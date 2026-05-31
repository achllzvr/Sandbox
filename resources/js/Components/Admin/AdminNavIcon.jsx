import {
    ClipboardList,
    CreditCard,
    LayoutDashboard,
    ScrollText,
    Users,
} from 'lucide-react';

const icons = {
    dashboard: LayoutDashboard,
    users: Users,
    certifications: ScrollText,
    teachers: Users,
    audit: ClipboardList,
    finance: CreditCard,
};

export default function AdminNavIcon({ name }) {
    const Icon = icons[name] || LayoutDashboard;

    return (
        <span className="admin-nav-link__icon">
            <Icon
                size={20}
                stroke="currentColor"
                fill="none"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            />
        </span>
    );
}
