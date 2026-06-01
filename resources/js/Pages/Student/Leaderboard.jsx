import { Head, Link, usePage } from '@inertiajs/react';
import { Flame, Medal, Trophy, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useMemo, useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { assetUrl } from '@/utils/assetUrl';

function resolveDisplayName(entry, authUser) {
    if (entry.is_current_user) {
        return authUser?.first_name ?? 'You';
    }

    return entry.display_name ?? 'Hermit';
}

function resolveHandle(entry, authUser) {
    if (entry.is_current_user) {
        const email = authUser?.email ?? 'student@example.com';
        return email.split('@')[0];
    }

    return entry.handle ?? 'hermit';
}

function RankDelta({ delta }) {
    if (delta > 0) {
        return (
            <span className="student-leaderboard-row__delta student-leaderboard-row__delta--up">
                <TrendingUp size={14} aria-hidden="true" />+{delta}
            </span>
        );
    }

    if (delta < 0) {
        return (
            <span className="student-leaderboard-row__delta student-leaderboard-row__delta--down">
                <TrendingDown size={14} aria-hidden="true" />
                {delta}
            </span>
        );
    }

    return (
        <span className="student-leaderboard-row__delta student-leaderboard-row__delta--flat">
            <Minus size={14} aria-hidden="true" />
        </span>
    );
}

function PodiumCard({ entry, authUser, place }) {
    const name = resolveDisplayName(entry, authUser);
    const isFirst = place === 1;

    return (
        <article className={`student-leaderboard-podium__item student-leaderboard-podium__item--${place}`}>
            <div className="student-leaderboard-podium__rank">#{entry.rank}</div>
            <div className={`student-leaderboard-podium__avatar ${isFirst ? 'student-leaderboard-podium__avatar--gold' : ''}`}>
                <img src={assetUrl('images/Hermy.png')} alt="" />
            </div>
            <h3 className="student-leaderboard-podium__name">{name}</h3>
            <p className="student-leaderboard-podium__score">🪙 {entry.sand_dollars.toLocaleString()}</p>
            <p className="student-leaderboard-podium__meta">{entry.completed_sandboxes} sandboxes</p>
        </article>
    );
}

function LeaderboardRow({ entry, authUser }) {
    const name = resolveDisplayName(entry, authUser);
    const handle = resolveHandle(entry, authUser);

    return (
        <article
            className={`student-leaderboard-row ${entry.is_current_user ? 'student-leaderboard-row--self' : ''} ${entry.is_top_mover ? 'student-leaderboard-row--mover' : ''}`}
        >
            <span className="student-leaderboard-row__rank">#{entry.rank}</span>
            <div className="student-leaderboard-row__profile">
                <img src={assetUrl('images/Hermy.png')} alt="" className="student-leaderboard-row__avatar" />
                <div>
                    <p className="student-leaderboard-row__name">
                        {name}
                        {entry.is_current_user ? <span className="student-leaderboard-row__you">You</span> : null}
                    </p>
                    <p className="student-leaderboard-row__handle">@{handle}</p>
                </div>
            </div>
            <div className="student-leaderboard-row__stats">
                <span className="student-leaderboard-row__stat">🪙 {entry.sand_dollars.toLocaleString()}</span>
                <span className="student-leaderboard-row__stat">
                    <Flame size={14} aria-hidden="true" /> {entry.streak_days}d
                </span>
                <span className="student-leaderboard-row__stat">{entry.completed_sandboxes} sandboxes</span>
            </div>
            <RankDelta delta={entry.rank_delta} />
        </article>
    );
}

export default function Leaderboard({
    is_mock = false,
    period = 'week',
    periods = [],
    entries_by_period = {},
    viewer = {},
}) {
    const { auth } = usePage().props;
    const [activePeriod, setActivePeriod] = useState(period);

    const entries = useMemo(
        () => entries_by_period[activePeriod] ?? entries_by_period.week ?? [],
        [entries_by_period, activePeriod],
    );

    const podium = entries.filter((entry) => entry.rank <= 3);
    const rest = entries.filter((entry) => entry.rank > 3);
    const viewerEntry = entries.find((entry) => entry.is_current_user);
    const periodOptions = periods.length
        ? periods
        : [
              { key: 'week', label: 'This week' },
              { key: 'all_time', label: 'All time' },
          ];

    return (
        <StudentLayout activeNav="leaderboard" layoutMode="select">
            <Head title="Leaderboard" />

            <div className="student-select-page student-leaderboard-page student-enter-stagger">
                <header className="student-home-header student-enter__item" style={{ '--student-enter-index': 0 }}>
                    <h2 className="student-page-title">Leaderboard</h2>
                    <p className="student-page-subtitle">See who is building the tallest sandcastles this week.</p>
                </header>

                {is_mock ? (
                    <div className="student-mock-banner student-enter__item" style={{ '--student-enter-index': 1 }}>
                        <strong>TODO[backend]:</strong> Rankings use mock data. Wire to sandbox completions, sand dollars,
                        and streak stats from the database.
                    </div>
                ) : null}

                <div className="student-leaderboard-toolbar student-enter__item" style={{ '--student-enter-index': 2 }}>
                    <div className="student-leaderboard-tabs" role="tablist" aria-label="Leaderboard period">
                        {periodOptions.map((option) => (
                            <button
                                key={option.key}
                                type="button"
                                role="tab"
                                aria-selected={activePeriod === option.key}
                                className={`student-leaderboard-tabs__btn ${activePeriod === option.key ? 'is-active' : ''}`}
                                onClick={() => setActivePeriod(option.key)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {viewer.is_ranked ? (
                    <section className="student-leaderboard-viewer student-enter__item" style={{ '--student-enter-index': 3 }}>
                        <div className="student-leaderboard-viewer__icon">
                            <Medal size={28} strokeWidth={2.25} aria-hidden="true" />
                        </div>
                        <div className="student-leaderboard-viewer__body">
                            <p className="student-leaderboard-viewer__eyebrow">Your placement</p>
                            <h3 className="student-leaderboard-viewer__title">
                                #{viewerEntry?.rank ?? viewer.rank} · {viewer.rank_title ?? 'Hermit'}
                            </h3>
                            <p className="student-leaderboard-viewer__text">
                                🪙 {viewer.sand_dollars?.toLocaleString()} sand dollars · {viewer.completed_sandboxes}{' '}
                                sandboxes · 🔥 {viewer.streak_days} day streak
                            </p>
                            {viewer.progress_to_next_rank != null ? (
                                <div className="student-leaderboard-viewer__progress">
                                    <div
                                        className="student-leaderboard-viewer__progress-fill"
                                        style={{ width: `${viewer.progress_to_next_rank}%` }}
                                    />
                                </div>
                            ) : null}
                            {viewer.next_rank_title ? (
                                <p className="student-leaderboard-viewer__next">
                                    {viewer.progress_to_next_rank}% toward {viewer.next_rank_title}
                                </p>
                            ) : null}
                        </div>
                    </section>
                ) : (
                    <section className="student-leaderboard-viewer student-leaderboard-viewer--unranked student-enter__item" style={{ '--student-enter-index': 3 }}>
                        <Trophy size={28} strokeWidth={2.25} aria-hidden="true" />
                        <div>
                            <h3 className="student-leaderboard-viewer__title">Not ranked yet</h3>
                            <p className="student-leaderboard-viewer__text">
                                Complete sandboxes in your shells to earn sand dollars and appear on the Hermit leaderboard.
                            </p>
                            <Link href={route('student.dashboard', { select: 1 })} className="student-btn student-btn--coral">
                                Go to My Shells
                            </Link>
                        </div>
                    </section>
                )}

                {entries.length === 0 ? (
                    <div className="student-empty student-enter__item" style={{ '--student-enter-index': 4 }}>
                        <p className="student-empty__title">No rankings yet</p>
                        <p className="student-page-subtitle">Be the first Hermit to complete a sandbox this week.</p>
                    </div>
                ) : (
                    <>
                        <section className="student-leaderboard-podium student-enter__item" style={{ '--student-enter-index': 4 }}>
                            {[2, 1, 3].map((place) => {
                                const entry = podium.find((item) => item.rank === place);
                                if (!entry) {
                                    return null;
                                }

                                return <PodiumCard key={entry.rank} entry={entry} authUser={auth?.user} place={place} />;
                            })}
                        </section>

                        <section className="student-leaderboard-list student-enter__item" style={{ '--student-enter-index': 5 }}>
                            <div className="student-shell-group__divider">
                                <span>All Hermits</span>
                            </div>
                            {rest.map((entry) => (
                                <LeaderboardRow key={`${activePeriod}-${entry.rank}`} entry={entry} authUser={auth?.user} />
                            ))}
                        </section>
                    </>
                )}
            </div>
        </StudentLayout>
    );
}
