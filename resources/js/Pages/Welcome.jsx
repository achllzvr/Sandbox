import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Sandbox LMS" />

            <div className="min-h-screen bg-[#F7F1E8]">
                {/* Navbar */}
                <nav className="flex items-center justify-between px-10 py-6">
                    <h1 className="text-3xl font-bold text-[#1E3A5F]">
                        Sandbox
                    </h1>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href="/dashboard"
                                className="rounded-lg bg-[#1E3A5F] px-5 py-2 text-white"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="font-medium text-[#1E3A5F]"
                                >
                                    Login
                                </Link>

                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-[#1E3A5F] px-5 py-2 text-white"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero */}
                <section className="mx-auto flex min-h-[80vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
                    <span className="mb-6 rounded-full bg-white px-5 py-2 text-sm font-medium text-[#40798C] shadow">
                        Modern Gamified LMS Platform
                    </span>

                    <h1 className="max-w-4xl text-6xl font-bold leading-tight text-[#1E3A5F]">
                        Learn through
                        <span className="text-[#40798C]"> Shells</span>,
                        <span className="text-[#648DB6]"> Sandboxes</span>,
                        and
                        <span className="text-[#1E3A5F]"> Sandcastles</span>.
                    </h1>

                    <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-600">
                        Sandbox is a gamified learning and certification platform
                        where students progress through structured modules,
                        complete assessments, and earn certifications in a
                        clean and modern LMS experience.
                    </p>

                    <div className="mt-10 flex gap-5">
                        <Link
                            href={route('register')}
                            className="rounded-xl bg-[#1E3A5F] px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:scale-105"
                        >
                            Start Learning
                        </Link>

                        <Link
                            href={route('login')}
                            className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-[#1E3A5F] shadow"
                        >
                            Login
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}