import { Head, Link } from '@inertiajs/react';

export default function Welcome({ canLogin, canRegister, authUser }) {
    const isLoggedIn = !!authUser;

    return (
        <div className="min-h-screen bg-[#FDFCFB] selection:bg-orange-500 selection:text-white">
            <Head title="Welcome to Sandbox" />

            {/* NAV */}
            <nav className="sticky top-0 z-50 bg-[#FDFCFB]/80 backdrop-blur-md border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/20">
                            S
                        </div>
                        <span className="font-black text-2xl text-stone-900 tracking-tighter">SANDBOX</span>
                    </div>
                    <div className="flex items-center gap-6">
                        {isLoggedIn ? (
                            <>
                                <span className="text-sm font-medium text-stone-500">
                                    Welcome back, {authUser.first_name}
                                </span>
                                <Link 
                                    href={route('dashboard')} 
                                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5"
                                >
                                    Go to Dashboard
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="text-sm font-bold text-stone-400 hover:text-red-500 transition-colors"
                                >
                                    Log out
                                </Link>
                            </>
                        ) : (
                            <>
                                {canLogin && (
                                    <Link href={route('login')} className="text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors">
                                        Log in
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link 
                                        href={route('register')} 
                                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5"
                                    >
                                        Get started
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <header className="relative overflow-hidden text-center pt-32 pb-24 px-6">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-400/5 rounded-full blur-3xl -z-10"></div>
                
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-bold mb-8 border border-orange-200 shadow-sm">
                    ✨ The Gamified Certification Platform
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-stone-900 leading-[1.1] mb-6 tracking-tight">
                    Learn. Certify. <br className="hidden md:block" />
                    <span className="text-orange-500">Build your shoreline.</span>
                </h1>
                <p className="text-stone-500 max-w-2xl mx-auto mt-4 text-xl leading-relaxed">
                    Sandbox turns certification into an adventure. Earn Sand Dollars, customize your avatar, and grow your tech skills one module at a time.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                    {isLoggedIn ? (
                        <Link href={route('dashboard')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1 text-lg">
                            Enter the Studio
                        </Link>
                    ) : (
                        <>
                            <Link href={route('register')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1 text-lg">
                                Browse Certifications
                            </Link>
                            <Link href={route('login')} className="bg-white border-2 border-stone-200 hover:border-stone-300 text-stone-700 font-bold px-8 py-4 rounded-full transition-all hover:bg-stone-50 text-lg">
                                Sign In
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* ROLE CARDS — only show for guests */}
            {!isLoggedIn && (
                <section className="pb-32 relative z-10">
                    <p className="text-center uppercase text-sm text-stone-400 tracking-widest mt-16 mb-10 font-bold">
                        Choose your path
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto">
                        
                        {/* CARD 1 — Student */}
                        <div className="group border-2 border-transparent hover:border-orange-500 rounded-3xl p-8 flex flex-col h-full bg-white shadow-xl shadow-stone-200/50 transition-all hover:-translate-y-2">
                            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                                🎓
                            </div>
                            <h3 className="font-black text-2xl text-stone-900 mb-3">Student</h3>
                            <p className="text-stone-500 text-base mb-6 flex-grow leading-relaxed">
                                Browse the marketplace, enroll in Shells, and earn your certifications while building your streak.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="bg-stone-100 text-stone-600 text-xs rounded-lg px-3 py-1.5 font-bold">Marketplace</span>
                                <span className="bg-stone-100 text-stone-600 text-xs rounded-lg px-3 py-1.5 font-bold">Sand Dollars</span>
                            </div>
                            <Link href={route('register')} className="block w-full text-center bg-stone-900 hover:bg-orange-500 text-white font-bold py-4 rounded-xl transition-colors">
                                Join as Student
                            </Link>
                        </div>

                        {/* CARD 2 — Teacher */}
                        <div className="group border-2 border-transparent hover:border-blue-500 rounded-3xl p-8 flex flex-col h-full bg-white shadow-xl shadow-stone-200/50 transition-all hover:-translate-y-2">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                                👥
                            </div>
                            <h3 className="font-black text-2xl text-stone-900 mb-3">Teacher / Affiliate</h3>
                            <p className="text-stone-500 text-base mb-6 flex-grow leading-relaxed">
                                Purchase bulk vouchers for your institution and track every student's progress via cohort analytics.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="bg-stone-100 text-stone-600 text-xs rounded-lg px-3 py-1.5 font-bold">Bulk Vouchers</span>
                                <span className="bg-stone-100 text-stone-600 text-xs rounded-lg px-3 py-1.5 font-bold">Analytics</span>
                            </div>
                            <Link href={route('register.teacher')} className="block w-full text-center bg-stone-100 hover:bg-blue-500 hover:text-white text-stone-700 font-bold py-4 rounded-xl transition-colors mt-auto">
                                Apply as Teacher
                            </Link>
                        </div>

                        {/* CARD 3 — Creator */}
                        <div className="group border-2 border-stone-100 rounded-3xl p-8 flex flex-col h-full bg-stone-50/50">
                            <div className="w-14 h-14 rounded-2xl bg-stone-200 flex items-center justify-center mb-6 text-2xl grayscale opacity-50">
                                ✏️
                            </div>
                            <h3 className="font-black text-2xl text-stone-400 mb-3">Content Creator</h3>
                            <p className="text-stone-400 text-base mb-6 flex-grow leading-relaxed">
                                Build certification Shells, upload exclusive content, and earn revenue directly from your enrollments.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-8 opacity-50">
                                <span className="bg-stone-200 text-stone-500 text-xs rounded-lg px-3 py-1.5 font-bold">Creator Studio</span>
                                <span className="bg-stone-200 text-stone-500 text-xs rounded-lg px-3 py-1.5 font-bold">70/30 Split</span>
                            </div>
                            <button disabled className="block w-full text-center border-2 border-stone-200 text-stone-400 font-bold py-4 rounded-xl mt-auto cursor-not-allowed">
                                Invite Only
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}