import { Head, Link } from '@inertiajs/react';

export default function Welcome({ canLogin, canRegister, authUser }) {
    const isLoggedIn = !!authUser;

    return (
        <div className="min-h-screen bg-white">
            <Head title="Welcome to Sandbox" />

            {/* NAV */}
            <nav className="sticky top-0 z-50 bg-white border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center text-white font-bold">
                            S
                        </div>
                        <span className="font-bold text-lg text-stone-900 tracking-tight">Sandbox</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {isLoggedIn ? (
                            <>
                                <span className="text-sm text-stone-500">
                                    Hi, {authUser.first_name}!
                                </span>
                                <Link href={route('dashboard')} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                    Go to Dashboard
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="text-sm font-medium text-stone-500 hover:text-red-600 transition-colors"
                                >
                                    Log out
                                </Link>
                            </>
                        ) : (
                            <>
                                {canLogin && (
                                    <Link href={route('login')} className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                                        Log in
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link href={route('register')} className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                        Get started
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <header className="text-center py-20 px-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-8">
                    Gamified certification platform
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight mb-4">
                    Learn. Certify. <br className="md:hidden" />
                    <span className="text-amber-600">Build your shoreline.</span>
                </h1>
                <p className="text-stone-500 max-w-lg mx-auto mt-4 text-lg">
                    Sandbox turns certification into an adventure — earn Sand Dollars, customize your avatar, and grow your skills one sandbox at a time.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                    {isLoggedIn ? (
                        <Link href={route('dashboard')} className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl transition-colors">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={route('register')} className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl transition-colors">
                                Browse certifications
                            </Link>
                            <Link href={route('login')} className="border border-stone-300 hover:bg-stone-50 text-stone-700 font-medium px-6 py-3 rounded-xl transition-colors">
                                Log in
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* ROLE CARDS — only show for guests */}
            {!isLoggedIn && (
                <section className="pb-20">
                    <p className="text-center uppercase text-xs text-stone-400 tracking-widest mt-16 mb-8 font-semibold">
                        Join as
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 max-w-5xl mx-auto">
                        {/* CARD 1 — Student */}
                        <div className="border-2 border-amber-400 rounded-2xl p-6 flex flex-col h-full bg-white relative overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-4 text-xl">
                                🎓
                            </div>
                            <h3 className="font-bold text-lg text-stone-900">Student</h3>
                            <p className="text-stone-500 text-sm mt-1 mb-4 flex-grow">
                                Browse the marketplace, enroll in shells, and earn your certifications.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="bg-amber-100 text-amber-800 text-xs rounded-full px-3 py-1 font-medium">Marketplace</span>
                                <span className="bg-amber-100 text-amber-800 text-xs rounded-full px-3 py-1 font-medium">Sand Dollars</span>
                                <span className="bg-amber-100 text-amber-800 text-xs rounded-full px-3 py-1 font-medium">Streaks</span>
                            </div>
                            <Link href={route('register')} className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-xl transition-colors">
                                Register as student
                            </Link>
                        </div>

                        {/* CARD 2 — Teacher */}
                        <div className="border border-stone-200 rounded-2xl p-6 flex flex-col h-full bg-white">
                            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center mb-4 text-xl">
                                👥
                            </div>
                            <h3 className="font-bold text-lg text-stone-900">Teacher / Affiliate</h3>
                            <p className="text-stone-500 text-sm mt-1 mb-4 flex-grow">
                                Purchase bulk vouchers for your class and track every student's progress.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-teal-100 text-teal-800 text-xs rounded-full px-3 py-1 font-medium">Bulk vouchers</span>
                                <span className="bg-teal-100 text-teal-800 text-xs rounded-full px-3 py-1 font-medium">Cohort analytics</span>
                            </div>
                            <p className="text-xs text-stone-400 italic mb-4">
                                Requires admin verification after registration.
                            </p>
                            <Link href={route('register.teacher')} className="block w-full text-center border border-stone-300 hover:bg-stone-50 text-stone-700 font-medium py-3 rounded-xl transition-colors mt-auto">
                                Register as teacher
                            </Link>
                        </div>

                        {/* CARD 3 — Creator */}
                        <div className="border border-stone-200 rounded-2xl p-6 flex flex-col h-full bg-white opacity-50 pointer-events-none">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-4 text-xl">
                                ✏️
                            </div>
                            <h3 className="font-bold text-lg text-stone-900">Content creator</h3>
                            <p className="text-stone-500 text-sm mt-1 mb-4 flex-grow">
                                Build certification shells, upload content, and earn from enrollments.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="bg-purple-100 text-purple-800 text-xs rounded-full px-3 py-1 font-medium">Creator studio</span>
                                <span className="bg-purple-100 text-purple-800 text-xs rounded-full px-3 py-1 font-medium">Revenue share</span>
                            </div>
                            <button disabled className="block w-full text-center border border-stone-200 text-stone-400 font-medium py-3 rounded-xl mt-auto">
                                Coming soon
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* GAMIFICATION STRIP */}
            <section className="bg-stone-100 py-16 px-6 mt-16">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-16 h-16 rounded-2xl bg-amber-200 flex shrink-0 items-center justify-center text-3xl shadow-sm">
                        🏆
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-stone-900">
                            Keep your streak. Spend your Sand Dollars.
                        </h3>
                        <p className="text-stone-600 mt-3 text-lg max-w-2xl">
                            Complete modules daily to maintain your learning streak. Every completed sandbox earns Sand Dollars — spend them in the Hermy shop to customize your avatar.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-8 mt-8">
                            <div>
                                <p className="font-bold text-stone-900 text-lg flex items-center gap-2">🔥 Streaks</p>
                                <p className="text-sm text-stone-500 mt-1">Daily learning rewards</p>
                            </div>
                            <div className="hidden sm:block w-px bg-stone-300"></div>
                            <div>
                                <p className="font-bold text-stone-900 text-lg flex items-center gap-2">💰 Sand Dollars</p>
                                <p className="text-sm text-stone-500 mt-1">Platform currency</p>
                            </div>
                            <div className="hidden sm:block w-px bg-stone-300"></div>
                            <div>
                                <p className="font-bold text-stone-900 text-lg flex items-center gap-2">🦀 Hermy</p>
                                <p className="text-sm text-stone-500 mt-1">Your avatar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-stone-200 py-6 px-6 bg-white mt-12">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-stone-400 text-sm">
                        © 2026 Sandbox — Certification Platform
                    </p>
                    <div className="flex gap-6">
                        <span className="text-stone-400 hover:text-stone-600 cursor-pointer text-sm transition-colors">Privacy</span>
                        <span className="text-stone-400 hover:text-stone-600 cursor-pointer text-sm transition-colors">Terms</span>
                        <span className="text-stone-400 hover:text-stone-600 cursor-pointer text-sm transition-colors">Contact</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}