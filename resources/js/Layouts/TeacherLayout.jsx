import { Link, usePage, router } from '@inertiajs/react';
import React from 'react';

export default function TeacherLayout({ children }) {
    const { url, props } = usePage();
    const auth = props.auth;

    const navItems = [
        { name: 'DASHBOARD', href: route('teacher.dashboard'), active: url === '/teacher/dashboard' },
        { name: 'SHOP', href: route('teacher.purchasing'), active: url.startsWith('/teacher/purchasing') },
        { name: 'MY VOUCHERS', href: route('teacher.vouchers'), active: url.startsWith('/teacher/vouchers') },
        { name: 'ANALYTICS', href: route('teacher.analytics'), active: url.startsWith('/teacher/analytics') },
    ];

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center p-4 md:p-8 font-sans">
            {/* Custom Google Font insertion */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800;900&display=swap');
                .cozy-theme {
                    font-family: 'Outfit', sans-serif;
                }
                .bubble-text {
                    font-family: 'Outfit', sans-serif;
                    font-weight: 900;
                    letter-spacing: -0.03em;
                    -webkit-text-stroke: 1.5px #5C4033;
                }
            `}</style>

            <div className="cozy-theme w-full max-w-[1280px] min-h-[85vh] bg-[#FDF6E2] rounded-[32px] border-4 border-[#5C4033] shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
                
                {/* 1. Left Sidebar */}
                <div className="w-full md:w-[240px] shrink-0 bg-[#F5EFCF] border-b-4 md:border-b-0 md:border-r-4 border-[#5C4033] p-6 flex flex-col justify-between">
                    <div>
                        {/* Logo "SANDBOX" in orange-coral bubble text */}
                        <div className="mb-8 mt-2 text-center md:text-left">
                            <span className="bubble-text text-4xl text-[#E2725B] tracking-tight block">
                                SANDBOX
                            </span>
                        </div>

                        {/* Navigation Buttons */}
                        <nav className="space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`block w-full text-center py-3 px-4 rounded-xl border-2 border-[#5C4033] font-bold text-sm transition-all duration-200 ${
                                        item.active
                                            ? 'bg-[#F9DCA2] text-[#5C4033] shadow-[4px_4px_0px_#5C4033] translate-x-[-2px] translate-y-[-2px]'
                                            : 'bg-[#FFFDF6] text-[#6E5042] hover:bg-[#FFFDF6]/80 hover:translate-y-[-1px]'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Bottom Info inside Left Sidebar */}
                    <div className="mt-8 pt-4 border-t border-[#5C4033]/20 hidden md:block">
                        <p className="text-xs text-[#8B6C58] font-bold uppercase tracking-wider text-center">
                            Teacher Portal
                        </p>
                    </div>
                </div>

                {/* 2. Main Content Area */}
                <div className="flex-1 bg-[#FDF6E2] p-6 md:p-10 overflow-y-auto max-h-[85vh]">
                    {children}
                </div>

                {/* 3. Right Sidebar Accent */}
                <div className="w-full md:w-[70px] shrink-0 bg-[#E2725B] border-t-4 md:border-t-0 md:border-l-4 border-[#5C4033] p-4 flex flex-row md:flex-col items-center justify-between">
                    {/* User Avatar */}
                    <div className="w-12 h-12 rounded-full border-2 border-[#FFFDF6] bg-[#FFFDF6] flex items-center justify-center text-2xl shadow-md overflow-hidden font-bold text-[#E2725B]">
                        {auth.user.first_name ? auth.user.first_name[0].toUpperCase() : 'T'}
                    </div>

                    {/* Quick back / logout button at the bottom */}
                    <button
                        onClick={handleLogout}
                        title="Log Out"
                        className="w-10 h-10 rounded-xl border-2 border-[#5C4033] bg-[#FFFDF6] flex items-center justify-center hover:bg-[#F5EFCF] hover:translate-y-[-2px] transition-all cursor-pointer font-bold text-[#5C4033] shadow-[2px_2px_0px_#5C4033]"
                    >
                        ←
                    </button>
                </div>

            </div>
        </div>
    );
}
