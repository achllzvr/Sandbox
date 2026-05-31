import { Link } from '@inertiajs/react';
import AdminCollapsedSidebarPopover from '@/Components/Admin/AdminCollapsedSidebarPopover';

export default function AdminCollapsedSidebarItem({ label, href, method, className, children }) {
    const linkProps =
        method === 'post'
            ? { href, method: 'post', as: 'button', type: 'button' }
            : { href };

    return (
        <div className="admin-sidebar-collapsed-item">
            <Link {...linkProps} className={className}>
                {children}
            </Link>
            <AdminCollapsedSidebarPopover label={label} />
        </div>
    );
}
