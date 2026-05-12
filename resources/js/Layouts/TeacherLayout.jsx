import { Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function TeacherLayout({ children }) {
    const { url } = usePage();

    const navItems = [
        { name: 'Dashboard', href: route('teacher.dashboard'), icon: '📊', active: url === '/teacher/dashboard' },
        { name: 'Bulk Purchasing', href: route('teacher.purchasing'), icon: '🛒', active: url.startsWith('/teacher/purchasing') },
        { name: 'Voucher Tracking', href: route('teacher.vouchers'), icon: '🎟️', active: url.startsWith('/teacher/vouchers') },
        { name: 'Cohort Analytics', href: route('teacher.analytics'), icon: '📈', active: url.startsWith('/teacher/analytics') },
    ];

    return (
        <AuthenticatedLayout
            auth={usePage().props.auth}
            header={<h2 className="font-semibold text-xl text-stone-800 leading-tight">Teacher Portal</h2>}
        >
            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                            <div className="p-4 bg-stone-50 border-b border-stone-100">
                                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Teacher Navigation</h3>
                            </div>
                            <nav className="p-2 space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                                            item.active 
                                            ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-100' 
                                            : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900 border border-transparent'
                                        }`}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
