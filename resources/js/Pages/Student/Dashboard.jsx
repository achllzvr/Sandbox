import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ gamification, myShells, recommendedShells }) {
    const { auth } = usePage().props;
    const firstName = auth.user.first_name;

    const [voucherCode, setVoucherCode] = useState('');
    const [redeeming, setRedeeming] = useState(false);

    const handleRedeem = (e) => {
        e.preventDefault();
        setRedeeming(true);
        setTimeout(() => setRedeeming(false), 1500);
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-extrabold text-stone-900 drop-shadow-sm tracking-tight">
                            Welcome back, {firstName}! 🏖️
                        </h2>
                        <p className="text-base text-stone-600 mt-1">Ready to build your next Sandcastle?</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-4">
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-amber-200 shadow-sm">
                            <span className="text-lg">🔥</span>
                            <span className="font-bold text-stone-800">{gamification.streak_days} Day Streak</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-amber-200 shadow-sm">
                            <span className="text-lg">🪙</span>
                            <span className="font-bold text-stone-800">{gamification.sand_dollars} Sand Dollars</span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="My Beach – Dashboard" />

            {/* Ambient background blobs */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-stone-50">
                <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-cyan-100/60 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] rounded-full bg-amber-100/40 blur-3xl translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">

                {/* ── Row 1: Profile card + Voucher widget ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Gamification / Hermy Profile Card */}
                    <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-amber-100 shadow-xl relative overflow-hidden hover:shadow-2xl transition-shadow duration-500">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

                        <div className="flex flex-col sm:flex-row gap-6 relative z-10 items-center sm:items-start">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                                <div className="relative w-28 h-28 bg-stone-100 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                                    <span className="text-5xl">🦀</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-xl font-bold text-stone-900">Your Hermy Profile</h3>
                                <p className="text-amber-600 font-medium text-sm flex items-center justify-center sm:justify-start gap-1 mt-1">
                                    <span>🏅</span> {gamification.rank}
                                </p>

                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-stone-500 font-medium mb-1.5">
                                        <span>Progress to next rank</span>
                                        <span>{gamification.progress_to_next_rank}%</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full relative transition-all duration-1000 ease-out"
                                            style={{ width: `${gamification.progress_to_next_rank}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-3 justify-center sm:justify-start">
                                    <Link
                                        href={route('marketplace.index')}
                                        className="text-xs font-semibold px-4 py-2 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors shadow-md"
                                    >
                                        Visit Marketplace
                                    </Link>
                                    <button className="text-xs font-semibold px-4 py-2 bg-amber-100 text-amber-800 rounded-xl hover:bg-amber-200 transition-colors flex items-center gap-1">
                                        <span>🏪</span> Hermy Shop
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Voucher Redemption Widget */}
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/4 translate-x-1/4 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span>🎟️</span>
                                <h3 className="text-lg font-bold">Have a Voucher?</h3>
                            </div>
                            <p className="text-cyan-100 text-sm mb-5">
                                Enter your teacher's code to unlock your next Shell and start learning.
                            </p>
                        </div>

                        <form onSubmit={handleRedeem} className="relative z-10 mt-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                    placeholder="Enter Code..."
                                    className="w-full bg-black/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-cyan-200/70 focus:outline-none focus:ring-2 focus:ring-white/50 font-mono uppercase transition-all"
                                    maxLength={12}
                                />
                                <button
                                    type="submit"
                                    disabled={!voucherCode.trim() || redeeming}
                                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-white text-blue-600 px-4 rounded-lg font-bold text-sm hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center"
                                >
                                    {redeeming ? 'Checking...' : 'Redeem'}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>{/* end Row 1 */}

                {/* ── Row 2: My Shells + Marketplace preview ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* My Active Shells */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                            🐚 My Active Shells
                        </h3>

                        {myShells.length > 0 ? (
                            <div className="space-y-4">
                                {myShells.map((shell) => (
                                    <div
                                        key={shell.id}
                                        className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                                    >
                                        <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${shell.color}`}></div>

                                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center ml-2">
                                            <div className={`w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br ${shell.color} p-0.5 shadow-sm`}>
                                                <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-[14px] flex items-center justify-center border border-white/40">
                                                    <span className="text-2xl">🏖️</span>
                                                </div>
                                            </div>

                                            <div className="flex-1 w-full">
                                                <h4 className="font-bold text-lg text-stone-900 group-hover:text-amber-600 transition-colors">
                                                    {shell.title}
                                                </h4>
                                                <div className="mt-3">
                                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                                        <span className="text-stone-500">Progress: {shell.completed_modules}/{shell.total_modules} Sandboxes</span>
                                                        <span className="text-stone-800">{shell.progress}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full bg-gradient-to-r ${shell.color} rounded-full`}
                                                            style={{ width: `${shell.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="shrink-0 w-full sm:w-auto mt-4 sm:mt-0 flex sm:flex-col items-center justify-between gap-3 border-t sm:border-t-0 sm:border-l border-stone-100 pt-4 sm:pt-0 sm:pl-5">
                                                <div className="text-left sm:text-center">
                                                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-0.5">Up Next</p>
                                                    <p className="text-xs font-semibold text-stone-700 line-clamp-1">{shell.next_sandbox}</p>
                                                </div>
                                                <Link href={route('student.shells.show', shell.id)} className="flex items-center gap-1.5 bg-stone-900 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                                                    <span>▶️</span> Continue
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white/60 backdrop-blur-sm border border-stone-200 border-dashed rounded-3xl p-10 text-center">
                                <div className="text-4xl mb-3">🌴</div>
                                <h4 className="text-lg font-bold text-stone-800">No active Shells yet</h4>
                                <p className="text-stone-500 text-sm mt-1 mb-4">It's a beautiful day to learn something new.</p>
                                <Link
                                    href={route('marketplace.index')}
                                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors"
                                >
                                    Explore Marketplace <span>→</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* New in Marketplace */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                            🌊 New in Marketplace
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            {recommendedShells.map((cert) => (
                                <Link
                                    href={route('marketplace.index')}
                                    key={cert.id}
                                    className="block bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                                >
                                    <div className="h-24 bg-gradient-to-r from-amber-100 to-cyan-100 relative overflow-hidden">
                                        <div className="absolute top-2 right-2 bg-white/90 text-xs font-bold px-2 py-1 rounded-lg text-amber-600 shadow-sm flex items-center gap-1">
                                            <span>⭐</span> {cert.rating}
                                        </div>
                                        <div className="absolute bottom-2 left-3 text-2xl">🐚</div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-stone-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                                            {cert.title}
                                        </h4>
                                        <p className="text-xs text-stone-500 mt-1">by {cert.creator}</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="font-bold text-stone-800 text-sm">
                                                {cert.price === 0 ? 'Free' : `₱${Number(cert.price).toFixed(2)}`}
                                            </span>
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                                                Preview
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Link
                            href={route('marketplace.index')}
                            className="block w-full py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-center rounded-xl text-sm font-bold transition-colors"
                        >
                            View All Certifications
                        </Link>
                    </div>

                </div>{/* end Row 2 */}

            </div>
        </AuthenticatedLayout>
    );
}
