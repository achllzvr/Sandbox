import { Link } from '@inertiajs/react';

export default function StudentCollapsedNavItem({ label, href, active, className, children }) {
    return (
        <div className="student-nav-collapsed-item">
            <Link href={href} className={className} aria-label={label}>
                {children}
            </Link>
            <span className="student-nav-popover" role="tooltip">
                {label}
            </span>
        </div>
    );
}
