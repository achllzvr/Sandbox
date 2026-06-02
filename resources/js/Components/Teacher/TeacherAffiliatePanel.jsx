import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { assetUrl } from '@/utils/assetUrl';

export default function TeacherAffiliatePanel({ collapsed, onToggle, onEmptyClick, embedded = false }) {
    const { auth, teacherPortalSummary } = usePage().props;
    const user = auth?.user;
    const summary = teacherPortalSummary ?? {};

    if (!user) {
        return null;
    }

    const handle = user.email?.split('@')[0] ?? 'affiliate';
    const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Affiliate';
    const affiliation = user.affiliation || summary.affiliation || 'Affiliate account';

    function handlePanelClick() {
        if (collapsed) {
            onEmptyClick();
        }
    }

    function handleToggle(event) {
        event.stopPropagation();
        onToggle(event);
    }

    return (
        <aside
            className={`student-profile student-profile--teacher ${embedded ? 'student-profile--embedded' : ''} ${collapsed ? 'student-profile--collapsed' : ''} student-fade-in-up student-fade-in-up--delay-1`}
            onClick={handlePanelClick}
            aria-label="Affiliate account panel"
        >
            {!collapsed && (
                <div className="student-profile__affiliate-top student-panel-swap">
                    <p className="student-profile__eyebrow">Affiliate</p>
                    <div className="student-profile__avatar-wrap">
                        <div className="student-profile__avatar">
                            <img src={assetUrl('images/Hermy.png')} alt="" width={96} height={96} />
                        </div>
                    </div>
                </div>
            )}

            {collapsed && (
                <div className="student-profile__avatar-wrap">
                    <div className="student-profile__avatar">
                        <img src={assetUrl('images/Hermy.png')} alt="" width={96} height={96} />
                    </div>
                </div>
            )}

            {!collapsed && (
                <div className="student-profile__meta student-profile__meta--teacher student-panel-swap">
                    <h2 className="student-profile__name">{displayName}</h2>
                    <span className="student-cast-status student-cast-status--active student-profile__role-badge">Educator / Affiliate</span>
                    <p className="student-profile__affiliate-meta-line">
                        <span className="student-profile__handle">@{handle}</span>
                        <span className="student-profile__affiliate-meta-dot" aria-hidden="true">
                            ·
                        </span>
                        <span className="student-profile__teacher-affiliation">{affiliation}</span>
                    </p>
                </div>
            )}

            {!collapsed && (summary.total_students != null || summary.vouchers_claimed != null) && (
                <>
                    <div className="student-shell-group__divider student-profile__affiliate-divider" aria-hidden="true" />
                    <div className="student-profile__affiliate-summary student-panel-swap">
                        {summary.total_students != null && (
                            <div className="student-profile__affiliate-chip">
                                <span className="student-profile__affiliate-chip-value">{summary.total_students}</span>
                                <span className="student-profile__affiliate-chip-label">Students</span>
                            </div>
                        )}
                        {summary.vouchers_claimed != null && (
                            <div className="student-profile__affiliate-chip">
                                <span className="student-profile__affiliate-chip-value">{summary.vouchers_claimed}</span>
                                <span className="student-profile__affiliate-chip-label">Claimed</span>
                            </div>
                        )}
                        {summary.vouchers_unclaimed != null && (
                            <div className="student-profile__affiliate-chip">
                                <span className="student-profile__affiliate-chip-value">{summary.vouchers_unclaimed}</span>
                                <span className="student-profile__affiliate-chip-label">Unclaimed</span>
                            </div>
                        )}
                    </div>
                </>
            )}

            <div className="student-profile__actions student-profile__actions--teacher">
                {!collapsed && (
                    <>
                        <Link
                            href={route('profile.edit')}
                            className="student-profile__settings-link student-profile__settings-link--primary student-panel-swap"
                            onClick={(event) => event.stopPropagation()}
                        >
                            Account settings
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            type="button"
                            className="student-profile__logout student-profile__logout--ghost student-panel-swap"
                            onClick={(event) => event.stopPropagation()}
                        >
                            Log out
                        </Link>
                    </>
                )}
                <button
                    type="button"
                    className="student-profile__toggle"
                    onClick={handleToggle}
                    aria-label={collapsed ? 'Expand affiliate panel' : 'Collapse affiliate panel'}
                    aria-expanded={!collapsed}
                >
                    {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
            </div>
        </aside>
    );
}
