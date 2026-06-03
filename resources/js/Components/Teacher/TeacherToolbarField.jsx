import { ChevronDown } from 'lucide-react';

export default function TeacherToolbarField({
    variant = 'search',
    className = '',
    children,
    icon: Icon,
    ...props
}) {
    const classes = ['teacher-toolbar-field', `teacher-toolbar-field--${variant}`, className].filter(Boolean).join(' ');

    if (variant === 'checkbox') {
        return (
            <label className={classes} {...props}>
                {children}
            </label>
        );
    }

    return (
        <div className={classes} {...props}>
            {Icon ? <Icon size={16} className="teacher-toolbar-field__icon" aria-hidden="true" /> : null}
            {children}
            {variant === 'select' ? <ChevronDown size={14} className="teacher-toolbar-field__select-icon" aria-hidden="true" /> : null}
        </div>
    );
}

export function TeacherToolbarSearchInput(props) {
    return <input type="search" {...props} />;
}

export function TeacherToolbarSelect({ children, ...props }) {
    return <select {...props}>{children}</select>;
}
