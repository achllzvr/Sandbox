import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle2, Clock3, Users } from 'lucide-react';
import StudentLayout from '@/Layouts/StudentLayout';
import { assetUrl } from '@/utils/assetUrl';

function resolveMemberName(member, authUser) {
    if (member.is_current_user) {
        return authUser?.first_name ?? 'You';
    }

    return member.display_name ?? 'Cast member';
}

function resolveMemberHandle(member, authUser) {
    if (member.is_current_user) {
        const email = authUser?.email ?? 'student@example.com';
        return email.split('@')[0];
    }

    return member.handle ?? 'member';
}

function CastStatusPill({ status, label }) {
    return <span className={`student-cast-status student-cast-status--${status}`}>{label}</span>;
}

function CastMemberRow({ member, authUser, cast }) {
    const name = resolveMemberName(member, authUser);
    const handle = resolveMemberHandle(member, authUser);

    return (
        <article
            className={`student-cast-member ${member.is_current_user ? 'student-cast-member--self' : ''} ${member.status === 'pending_enrollment' ? 'student-cast-member--pending' : ''}`}
        >
            <img src={assetUrl('images/Hermy.png')} alt="" className="student-cast-member__avatar" />
            <div className="student-cast-member__body">
                <div className="student-cast-member__head">
                    <p className="student-cast-member__name">
                        {name}
                        {member.is_current_user ? <span className="student-cast-member__you">You</span> : null}
                    </p>
                    <CastStatusPill status={member.status} label={member.status_label} />
                </div>
                <p className="student-cast-member__handle">@{handle}</p>
                {member.status === 'pending_enrollment' ? (
                    <div className="student-cast-member__note">
                        <p>Waiting to redeem your group voucher and enroll in {cast.shell_title}.</p>
                        {member.is_current_user && member.redeem_voucher_code ? (
                            <Link
                                href={route('marketplace.index')}
                                className="student-btn student-btn--coral student-cast-member__cta"
                            >
                                Redeem voucher ({member.redeem_voucher_code})
                            </Link>
                        ) : null}
                    </div>
                ) : member.status === 'not_started' ? (
                    <p className="student-cast-member__note">Joined the cast but has not opened the shell yet.</p>
                ) : (
                    <>
                        <div className="student-cast-member__progress-bar">
                            <div
                                className="student-cast-member__progress-fill"
                                style={{ width: `${member.progress_pct}%` }}
                            />
                        </div>
                        <p className="student-cast-member__progress-text">
                            {member.completed_modules}/{member.total_modules} sandboxes · {member.progress_pct}%
                            {member.status === 'certified' ? (
                                <CheckCircle2 size={14} aria-hidden="true" className="student-cast-member__cert-icon" />
                            ) : null}
                        </p>
                    </>
                )}
            </div>
        </article>
    );
}

function CastCard({ cast, authUser }) {
    const isExpired = cast.status === 'expired';

    return (
        <section className={`student-cast-card student-cast-card--${cast.status}`}>
            <header className="student-cast-card__header">
                <div className="student-cast-card__heading">
                    <div className="student-cast-card__icon">
                        <Users size={22} strokeWidth={2.25} aria-hidden="true" />
                    </div>
                    <div>
                        <h3 className="student-cast-card__title">{cast.name}</h3>
                        <p className="student-cast-card__shell">{cast.shell_title}</p>
                    </div>
                </div>
                <CastStatusPill status={cast.status} label={cast.status_label} />
            </header>

            <div className="student-cast-card__meta">
                <p>
                    <strong>Teacher:</strong> {cast.teacher_name}
                </p>
                <p>
                    <strong>Voucher:</strong> {cast.voucher_label}
                </p>
                <p>
                    <strong>Members:</strong> {cast.member_count}
                </p>
            </div>

            {isExpired ? (
                <div className="student-cast-card__alert">
                    <Clock3 size={16} aria-hidden="true" />
                    This cast&apos;s group voucher has expired. Progress is read-only until the teacher renews seats.
                </div>
            ) : null}

            <div className="student-shell-group__divider">
                <span>Cast progress</span>
            </div>

            <div className="student-cast-card__members">
                {cast.members.map((member) => (
                    <CastMemberRow key={member.id} member={member} authUser={authUser} cast={cast} />
                ))}
            </div>
        </section>
    );
}

export default function MyCast({ is_mock = false, casts = [] }) {
    const { auth } = usePage().props;

    return (
        <StudentLayout activeNav="cast" layoutMode="select">
            <Head title="My Cast" />

            <div className="student-select-page student-cast-page student-enter-stagger">
                <header className="student-home-header student-enter__item" style={{ '--student-enter-index': 0 }}>
                    <h2 className="student-page-title">My Cast</h2>
                    <p className="student-page-subtitle">
                        See your class cohort and track shell progress with castmates from teacher group vouchers.
                    </p>
                </header>

                {is_mock ? (
                    <div className="student-mock-banner student-enter__item" style={{ '--student-enter-index': 1 }}>
                        <strong>TODO[backend]:</strong> Casts appear when a teacher purchases a group voucher. Wire
                        casts, cast_members, and voucher redemption to replace this mock preview.
                    </div>
                ) : null}

                {casts.length === 0 ? (
                    <div className="student-empty student-cast-empty student-enter__item" style={{ '--student-enter-index': 2 }}>
                        <img src={assetUrl('images/Hermy.png')} alt="" className="student-cast-empty__icon" />
                        <p className="student-empty__title">No cast yet</p>
                        <p className="student-page-subtitle">
                            You&apos;ll join a cast when your teacher buys a group voucher and adds you to their class
                            shell. Until then, enroll on your own from the shop.
                        </p>
                        <Link href={route('marketplace.index')} className="student-btn student-btn--coral student-empty__cta">
                            Browse available shells
                        </Link>
                    </div>
                ) : (
                    <div className="student-cast-list student-enter__item" style={{ '--student-enter-index': 2 }}>
                        {casts.map((cast) => (
                            <CastCard key={cast.id} cast={cast} authUser={auth?.user} />
                        ))}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
