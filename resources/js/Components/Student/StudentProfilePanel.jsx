import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Pencil, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';
import { assetUrl } from '@/utils/assetUrl';

export default function StudentProfilePanel({ collapsed, onToggle, onEmptyClick, embedded = false }) {
    const { auth, studentGamification, mustVerifyEmail, status } = usePage().props;
    const user = auth?.user;
    const gamification = studentGamification ?? {};
    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => {
        if (collapsed) {
            setEditOpen(false);
        }
    }, [collapsed]);

    if (!user) {
        return null;
    }

    const handle = user.email?.split('@')[0] ?? 'student';
    const displayName = gamification.hermy_name ?? user.first_name ?? 'Hermy';
    const badges = gamification.badges ?? [];

    function handlePanelClick(event) {
        if (collapsed) {
            onEmptyClick();
        }
    }

    function toggleEdit(event) {
        event.stopPropagation();
        setEditOpen((current) => !current);
    }

    return (
        <aside
            className={`student-profile ${embedded ? 'student-profile--embedded' : ''} ${collapsed ? 'student-profile--collapsed' : ''} ${editOpen ? 'student-profile--editing' : ''} student-fade-in-up student-fade-in-up--delay-1`}
            onClick={handlePanelClick}
            aria-label="My Hermit profile"
        >
            {!collapsed && (
                <h2 className="student-profile__heading">my Hermit</h2>
            )}

            <div className="student-profile__avatar-wrap">
                <div className="student-profile__avatar">
                    <img src={assetUrl('images/Hermy.png')} alt="" width={96} height={96} />
                </div>
                {!collapsed && (
                    <button
                        type="button"
                        className="student-profile__edit"
                        onClick={toggleEdit}
                        aria-label={editOpen ? 'Close profile settings' : 'Edit profile and view progress'}
                        aria-expanded={editOpen}
                    >
                        {editOpen ? <X size={14} strokeWidth={2.5} /> : <Pencil size={14} strokeWidth={2.5} />}
                    </button>
                )}
            </div>

            {!collapsed && !editOpen && (
                <div className="student-profile__meta student-panel-swap">
                    <p className="student-profile__name">
                        {displayName}
                        <span className="student-profile__shell-icon" aria-hidden="true">
                            🐚
                        </span>
                    </p>
                    <p className="student-profile__handle">@{handle}</p>
                </div>
            )}

            {!collapsed && editOpen && (
                <div className="student-profile__edit-panel student-panel-swap">
                    <div className="student-profile__gamification">
                        <div className="student-profile__stat">
                            <span className="student-profile__stat-label">Streak</span>
                            <span className="student-profile__stat-value">🔥 {gamification.streak_days ?? 0} days</span>
                        </div>
                        <div className="student-profile__stat">
                            <span className="student-profile__stat-label">Sand dollars</span>
                            <span className="student-profile__stat-value">🪙 {gamification.sand_dollars ?? 0}</span>
                        </div>
                        {gamification.rank && (
                            <div className="student-profile__stat">
                                <span className="student-profile__stat-label">Rank</span>
                                <span className="student-profile__stat-value">🏅 {gamification.rank}</span>
                            </div>
                        )}
                    </div>

                    {badges.length > 0 && (
                        <div className="student-profile__badges">
                            <p className="student-profile__badges-title">Badges</p>
                            <div className="student-profile__badges-list">
                                {badges.map((badge) => (
                                    <span key={badge.id ?? badge.label} className="student-profile__badge">
                                        {badge.icon ? `${badge.icon} ` : ''}
                                        {badge.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="student-profile__forms">
                        <div className="student-profile__form-card">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                variant="student"
                            />
                        </div>
                        <div className="student-profile__form-card">
                            <UpdatePasswordForm variant="student" />
                        </div>
                        <div className="student-profile__form-card">
                            <DeleteUserForm variant="student" />
                        </div>
                    </div>
                </div>
            )}

            <div className="student-profile__actions">
                {!collapsed && !editOpen && (
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        type="button"
                        className="student-profile__logout student-panel-swap"
                        onClick={(event) => event.stopPropagation()}
                    >
                        LOGOUT
                    </Link>
                )}
                <button
                    type="button"
                    className="student-profile__toggle"
                    onClick={onToggle}
                    aria-label={collapsed ? 'Expand profile panel' : 'Collapse profile panel'}
                    aria-expanded={!collapsed}
                >
                    {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
            </div>
        </aside>
    );
}
