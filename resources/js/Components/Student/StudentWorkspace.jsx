import { useCallback, useEffect, useState } from 'react';
import StudentProfilePanel from '@/Components/Student/StudentProfilePanel';
import StudentShellSidebar from '@/Components/Student/StudentShellSidebar';

const PROFILE_KEY = 'sandbox-student-profile-collapsed';

export default function StudentWorkspace({ layoutMode = 'standard', children }) {
    const shellActive = layoutMode === 'shell';
    const [profileCollapsed, setProfileCollapsed] = useState(!shellActive);

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
            <div className="student-workspace__primary">{children}</div>
            {shellActive ? (
                <StudentShellSidebar {...sidebarProps} />
            ) : (
                <StudentProfilePanel embedded {...sidebarProps} />
            )}
        </div>
    );
}
