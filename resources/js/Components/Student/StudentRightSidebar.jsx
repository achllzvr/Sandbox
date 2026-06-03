import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function StudentRightSidebar({
    collapsed,
    onToggle,
    hideWhenCollapsed = false,
    ariaLabel,
    className = '',
    style = {},
    children,
}) {
    function handleToggle(event) {
        event.stopPropagation();
        onToggle(event);
    }

    const fullyHidden = hideWhenCollapsed && collapsed;

    return (
        <aside
            className={[
                'student-right-sidebar',
                collapsed ? 'student-right-sidebar--collapsed' : '',
                fullyHidden ? 'student-right-sidebar--fully-hidden' : '',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            aria-label={ariaLabel}
            aria-hidden={fullyHidden}
            style={style}
        >
            <div className="student-right-sidebar__body" aria-hidden={fullyHidden}>
                <div className="student-right-sidebar__content">{children}</div>

                <div className="student-right-sidebar__actions">
                    <button
                        type="button"
                        className="student-right-sidebar__collapse"
                        onClick={handleToggle}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        aria-expanded={!collapsed}
                    >
                        {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>
            </div>
        </aside>
    );
}
