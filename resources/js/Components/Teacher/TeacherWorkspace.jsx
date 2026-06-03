import { useCallback, useEffect, useState } from 'react';
import TeacherAffiliatePanel from '@/Components/Teacher/TeacherAffiliatePanel';

const PANEL_KEY = 'sandbox-teacher-panel-collapsed';

function readPanelCollapsed(fallback) {
    if (typeof window === 'undefined') {
        return fallback;
    }

    const stored = window.localStorage.getItem(PANEL_KEY);
    if (stored === '1') {
        return true;
    }
    if (stored === '0') {
        return false;
    }

    return fallback;
}

export default function TeacherWorkspace({ layoutMode = 'standard', modifier, children }) {
    const shopDetail = layoutMode === 'shell' || layoutMode === 'shop-detail';
    const [panelCollapsed, setPanelCollapsed] = useState(() => readPanelCollapsed(!shopDetail));

    useEffect(() => {
        if (shopDetail) {
            setPanelCollapsed(false);
        } else {
            setPanelCollapsed(true);
        }
    }, [shopDetail, layoutMode]);

    useEffect(() => {
        window.localStorage.setItem(PANEL_KEY, panelCollapsed ? '1' : '0');
    }, [panelCollapsed]);

    const togglePanel = useCallback((event) => {
        event?.stopPropagation();
        setPanelCollapsed((current) => !current);
    }, []);

    function handlePanelEmptyClick() {
        if (panelCollapsed) {
            setPanelCollapsed(false);
        }
    }

    const panelProps = {
        collapsed: panelCollapsed,
        onToggle: togglePanel,
        onEmptyClick: handlePanelEmptyClick,
    };

    return (
        <div
            className={`teacher-workspace student-workspace student-workspace--select ${panelCollapsed ? 'student-workspace--profile-collapsed' : ''}${modifier ? ` student-workspace--${modifier}` : ''}`}
        >
            <div className="teacher-workspace__primary student-workspace__primary">{children}</div>
            <TeacherAffiliatePanel embedded {...panelProps} />
        </div>
    );
}
