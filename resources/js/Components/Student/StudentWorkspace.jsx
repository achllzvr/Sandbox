import { useCallback, useEffect, useState } from 'react';
import StudentProfilePanel from '@/Components/Student/StudentProfilePanel';
import StudentShellSidebar from '@/Components/Student/StudentShellSidebar';

const PROFILE_KEY = 'sandbox-student-profile-collapsed';

function readProfileCollapsed(fallback) {
    if (typeof window === 'undefined') {
        return fallback;
    }

    const stored = window.localStorage.getItem(PROFILE_KEY);
    if (stored === '1') {
        return true;
    }
    if (stored === '0') {
        return false;
    }

    return fallback;
}

export default function StudentWorkspace({ layoutMode = 'standard', children }) {
    const shellActive = layoutMode === 'shell';
    const [profileCollapsed, setProfileCollapsed] = useState(() => readProfileCollapsed(!shellActive));

    useEffect(() => {
        if (shellActive) {
            setProfileCollapsed(false);
        } else {
            setProfileCollapsed(true);
        }
    }, [shellActive, layoutMode]);

    useEffect(() => {
        window.localStorage.setItem(PROFILE_KEY, profileCollapsed ? '1' : '0');
    }, [profileCollapsed]);

    const toggleProfile = useCallback((event) => {
        event?.stopPropagation();
        setProfileCollapsed((current) => !current);
    }, []);

    function handleProfileEmptyClick() {
        if (profileCollapsed) {
            setProfileCollapsed(false);
        }
    }

    const sidebarProps = {
        collapsed: profileCollapsed,
        onToggle: toggleProfile,
        onEmptyClick: handleProfileEmptyClick,
    };

    return (
        <div
            className={`student-workspace ${shellActive ? 'student-workspace--shell' : 'student-workspace--select'} ${profileCollapsed ? 'student-workspace--profile-collapsed' : ''}`}
        >
            <div
                id={shellActive ? 'student-shell-scroll' : undefined}
                className="student-workspace__primary"
            >
                {children}
            </div>
            {shellActive ? (
                <StudentShellSidebar {...sidebarProps} />
            ) : (
                <StudentProfilePanel embedded {...sidebarProps} />
            )}
        </div>
    );
}
