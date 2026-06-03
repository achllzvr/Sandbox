import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Shell, ShoppingBag } from 'lucide-react';
import TeacherWorkspace from '@/Components/Teacher/TeacherWorkspace';
import { assetUrl } from '@/utils/assetUrl';

const NAV_ITEMS = [
    { label: 'Dashboard', routeName: 'teacher.dashboard', key: 'dashboard', Icon: LayoutDashboard },
    { label: 'Shop', routeName: 'teacher.shop.index', key: 'shop', Icon: ShoppingBag },
    { label: 'My Shells', routeName: 'teacher.shells.index', key: 'shells', Icon: Shell },
];

export default function TeacherLayout({ children, activeNav, layoutMode = 'standard', workspaceModifier }) {
    const { flash } = usePage().props;
    const usesWorkspace = layoutMode === 'shell' || layoutMode === 'select' || layoutMode === 'shop-detail';
    const isShellPage = layoutMode === 'shell' || layoutMode === 'shop-detail';

    function isNavActive(item) {
        if (activeNav === item.key) {
            return true;
        }
        try {
            return route().current(item.routeName);
        } catch {
            return false;
        }
    }

    return (
        <div className={`student-shell ${isShellPage ? 'student-shell--shell-page' : ''}`}>
            <aside className="student-nav student-fade-in-up" aria-label="Teacher navigation">
                <div className="student-nav__inner">
                    <Link href={route('teacher.dashboard')} className="student-nav__logo">
                        <img
                            src={assetUrl('images/Hermy.png')}
                            alt=""
                            className="student-nav__logo-mark"
                            width={32}
                            height={32}
                        />
                        <span>Sandbox</span>
                    </Link>

                    <nav className="student-nav__links">
                        {NAV_ITEMS.map((item) => {
                            const active = isNavActive(item);
                            const Icon = item.Icon;

                            return (
                                <Link
                                    key={item.key}
                                    href={route(item.routeName)}
                                    className={`student-nav__link ${active ? 'student-nav__link--active' : ''}`}
                                >
                                    <span className="student-nav__link-icon-wrap">
                                        <Icon className="student-nav__link-icon" size={22} strokeWidth={2} aria-hidden="true" />
                                    </span>
                                    <span className="student-nav__link-text">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            <main className="student-main student-content--animated">
                {usesWorkspace ? (
                    <TeacherWorkspace layoutMode={layoutMode} modifier={workspaceModifier}>
                        {children}
                    </TeacherWorkspace>
                ) : (
                    children
                )}
            </main>

            {flash?.success || flash?.error || flash?.teacher_purchase_success || flash?.voucher_email_sent ? (
                <div
                    className={`student-flash student-flash--floating ${flash.error ? 'student-flash--error' : 'student-flash--success'} student-fade-in-up`}
                    role="status"
                >
                    {flash.error ||
                        flash.success ||
                        (flash.teacher_purchase_success
                            ? `Purchase complete — ${flash.teacher_purchase_success.quantity} voucher${flash.teacher_purchase_success.quantity === 1 ? '' : 's'}.`
                            : null) ||
                        (flash.voucher_email_sent ? `Voucher sent to ${flash.voucher_email_sent.email}.` : null)}
                </div>
            ) : null}
        </div>
    );
}
