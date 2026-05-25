import React, { useState } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

export default function Index({ certifications }) {
    const { auth, flash } = usePage().props;

    // --- UI Flow State ---
    const [selectedCert, setSelectedCert] = useState(null);
    const [modalView, setModalView] = useState('details'); // 'details', 'enroll_tos', 'voucher'

    // --- Forms ---
    const enrollForm = useForm({
        certification_id: null,
        payment_method: 'xendit',
        tos_action_irreversible: false,
        tos_privacy_act: false,
    });

    const voucherForm = useForm({
        certification_id: null,
        code: ''
    });

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    }

    function formatPrice(price) {
        const num = parseFloat(price);
        return num === 0 ? 'Free' : `₱${num.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
    }

    // --- Handlers ---
    const openShellDetail = (cert) => {
        setSelectedCert(cert);
        setModalView('details');
    }

    const closeModal = () => {
        setSelectedCert(null);
        setModalView('details');
        enrollForm.reset();
        voucherForm.reset();
        enrollForm.clearErrors();
        voucherForm.clearErrors();
    }

    const openEnrollmentToS = () => {
        setModalView('enroll_tos');
        enrollForm.setData({
            certification_id: selectedCert.id,
            payment_method: 'xendit',
            tos_action_irreversible: false,
            tos_privacy_act: false,
        });
    }

    const submitEnrollment = (e) => {
        e.preventDefault();
        enrollForm.post(route('student.enrollments.checkout'), {
            onSuccess: () => closeModal()
        });
    }

    const openVoucherParams = () => {
        setModalView('voucher');
        voucherForm.setData({
            certification_id: selectedCert.id,
            code: ''
        });
    }

    const submitVoucher = (e) => {
        e.preventDefault();
        voucherForm.post(route('student.vouchers.redeem'), {
            onSuccess: () => closeModal()
        });
    }

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('student.dashboard')}
                        className="bg-white border text-center border-stone-200 text-stone-500 hover:text-stone-700 hover:bg-stone-50 p-2.5 rounded-full transition-colors shadow-sm"
                        title="Back to Dashboard"
                    >
                        {/* Inline SVG for Back Arrow */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinelinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-stone-900">Marketplace</h2>
                        <p className="text-sm text-stone-500 mt-1">Browse available Shells and start your certification journey.</p>
                    </div>
                </div>
            }
        >
            <Head title="Marketplace" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

                {/* Success flash */}
                {flash?.success && (
                    <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700 font-medium">
                        {flash.success}
                    </div>
                )}

                {/* Empty state */}
                {certifications.data.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="text-5xl mb-4">🐚</div>
                        <h3 className="text-xl font-bold text-stone-700">No Shells available yet</h3>
                        <p className="text-stone-400 mt-2 text-sm max-w-sm mx-auto">
                            Check back soon — new certifications are published regularly.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {certifications.data.map((cert) => (
                                <div
                                    key={cert.id}
                                    className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                                >
                                    {/* Card header accent */}
                                    <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-500" />

                                    <div className="p-6 flex flex-col flex-grow">
                                        {/* Title & Badge */}
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-bold text-lg text-stone-900 leading-snug line-clamp-2">
                                                {cert.title}
                                            </h3>
                                            {(cert.status === 'approved' || cert.status === 'published') && (
                                                <span title="Verified Certification" className="flex-shrink-0 bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2 py-1 rounded-md border border-blue-200">
                                                    ✓ Verified
                                                </span>
                                            )}
                                        </div>

                                        {/* Creator + Date */}
                                        <p className="text-xs text-stone-400 mt-1.5">
                                            by{' '}
                                            <span className="text-stone-600 font-medium">
                                                {cert.creator
                                                    ? `${cert.creator.first_name} ${cert.creator.last_name}`
                                                    : 'Unknown'}
                                            </span>
                                            {' · '}
                                            {formatDate(cert.created_at)}
                                        </p>

                                        {/* Description */}
                                        <p className="text-sm text-stone-500 mt-3 line-clamp-3 flex-grow">
                                            {cert.description || 'No description provided.'}
                                        </p>

                                        {/* Meta pills */}
                                        <div className="flex items-center gap-3 mt-4">
                                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
                                                💰 {formatPrice(cert.price)}
                                            </span>
                                            <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 text-xs font-semibold px-3 py-1 rounded-full">
                                                🎯 {cert.pass_threshold}% to pass
                                            </span>
                                        </div>

                                        {/* Action button */}
                                        <button
                                            onClick={() => openShellDetail(cert)}
                                            className="mt-5 w-full text-center bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                                        >
                                            View Shell
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {certifications.last_page > 1 && (
                            <nav className="mt-10 flex justify-center gap-2">
                                {certifications.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                            link.active
                                                ? 'bg-amber-500 text-white font-bold'
                                                : link.url
                                                    ? 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                                                    : 'text-stone-300 cursor-not-allowed'
                                        }`}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        )}
                    </>
                )}
            </div>

            {/* ── Shell Details & Flow Modals ── */}
            {selectedCert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-amber-100 flex flex-col">
                        
                        {/* Header */}
                        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                            <button onClick={() => modalView !== 'details' ? setModalView('details') : closeModal()} className="text-stone-400 hover:text-stone-700 font-bold p-1">
                                {modalView !== 'details' ? '← Back' : '✕ Close'}
                            </button>
                            <h3 className="font-extrabold text-stone-800 text-sm tracking-wide">
                                {modalView === 'details' ? selectedCert.title : modalView === 'enroll_tos' ? 'YOU ARE ENROLLING' : 'REDEEM VOUCHER'}
                            </h3>
                            <div className="w-8"></div> {/* Spacer for centering */}
                        </div>

                        {/* Body based on state */}
                        <div className="p-6 bg-stone-50 flex-grow">
                            
                            {/* 1. DETAILS VIEW */}
                            {modalView === 'details' && (
                                <div className="space-y-5">
                                    <div className="text-center space-y-2">
                                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-inner border border-blue-300">
                                            <span className="text-4xl text-white font-bold">{selectedCert.title.charAt(0)}</span>
                                        </div>
                                        <h2 className="text-xl font-black text-blue-600 tracking-tight leading-tight">{selectedCert.title}</h2>
                                        <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest">Professional Certificate</p>
                                    </div>

                                    <div className="bg-white p-4 rounded-2xl border border-stone-200 text-sm text-stone-600 shadow-sm leading-relaxed">
                                        {selectedCert.description || "An exam that covers the basics and foundational skills required. Ensure that you learn the fundamentals and modern technologies associated."}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                         <div className="bg-white p-3 rounded-xl border border-stone-200 text-center shadow-sm">
                                            <span className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Duration</span>
                                            <span className="text-sm font-extrabold text-blue-600">Self-Paced</span>
                                         </div>
                                         <div className="bg-white p-3 rounded-xl border border-stone-200 text-center shadow-sm">
                                            <span className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Passing Goal</span>
                                            <span className="text-sm font-extrabold text-amber-500">{selectedCert.pass_threshold}%</span>
                                         </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <button 
                                            onClick={openEnrollmentToS}
                                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-extrabold py-3.5 px-4 rounded-2xl transition-colors shadow-md shadow-blue-500/20"
                                        >
                                            ENROLL FOR {formatPrice(selectedCert.price)}
                                        </button>

                                        <button 
                                            onClick={openVoucherParams}
                                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 font-extrabold py-3 px-4 rounded-xl transition-colors"
                                        >
                                            HAVE A VOUCHER?
                                        </button>
                                        
                                        {/* Mock diagnostic link */}
                                        <button 
                                            onClick={() => alert("Diagnostic Pre-Assessment Coming Soon!")}
                                            className="w-full bg-white hover:bg-stone-50 text-stone-500 border border-stone-200 font-bold py-2.5 px-4 rounded-xl transition-colors text-xs"
                                        >
                                            TRY A QUICK TEST
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* 2. ENROLLMENT ToS VIEW */}
                            {modalView === 'enroll_tos' && (
                                <form onSubmit={submitEnrollment} className="space-y-5">
                                    <div className="bg-blue-500 p-3 rounded-xl text-center shadow-inner">
                                        <h3 className="text-white font-black">{selectedCert.title}</h3>
                                        <span className="text-blue-100 text-[10px] uppercase font-bold tracking-widest">Professional Certificate</span>
                                    </div>

                                    <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4 shadow-sm">
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input 
                                                type="checkbox" 
                                                className="mt-1 w-5 h-5 rounded border-stone-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                                                checked={enrollForm.data.tos_action_irreversible}
                                                onChange={e => enrollForm.setData('tos_action_irreversible', e.target.checked)}
                                            />
                                            <span className="text-sm font-medium text-stone-700 leading-snug select-none group-hover:text-stone-900 transition-colors">
                                                Do you understand that this action is <strong className="text-red-500">irreversible</strong> and refunds are not allowed?
                                            </span>
                                        </label>

                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input 
                                                type="checkbox" 
                                                className="mt-1 w-5 h-5 rounded border-stone-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                                                checked={enrollForm.data.tos_privacy_act}
                                                onChange={e => enrollForm.setData('tos_privacy_act', e.target.checked)}
                                            />
                                            <span className="text-sm font-medium text-stone-700 leading-snug select-none group-hover:text-stone-900 transition-colors">
                                                Do you accept the <strong className="text-stone-900">Terms of Service</strong> and you allow Sandbox to process your data with respect to the <strong className="text-stone-900">Data Privacy Act of 2012</strong>?
                                            </span>
                                        </label>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <button 
                                            type="submit"
                                            disabled={!enrollForm.data.tos_action_irreversible || !enrollForm.data.tos_privacy_act || enrollForm.processing}
                                            className="w-full bg-blue-500 disabled:bg-stone-300 disabled:cursor-not-allowed hover:bg-blue-600 text-white font-extrabold py-3.5 px-4 rounded-2xl transition-colors shadow-md"
                                        >
                                            {enrollForm.processing ? 'PROCESSING...' : `ENROLL FOR ${formatPrice(selectedCert.price)}`}
                                        </button>

                                        <button 
                                            type="button"
                                            onClick={openVoucherParams}
                                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 font-extrabold py-3 px-4 rounded-xl transition-colors"
                                        >
                                            HAVE A VOUCHER?
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* 3. VOUCHER VIEW */}
                            {modalView === 'voucher' && (
                                <form onSubmit={submitVoucher} className="space-y-6">
                                     <div className="text-center pt-2">
                                        <h4 className="font-extrabold text-stone-800 text-lg mb-4 opacity-0 h-0">Voucher Field</h4>
                                        
                                        {voucherForm.errors.code && (
                                            <div className="mb-4 bg-red-100 text-red-500 text-xs font-bold py-2 px-3 rounded-lg border border-red-200 animate-in shake">
                                                {voucherForm.errors.code}
                                            </div>
                                        )}

                                        <div className="bg-amber-100/50 p-6 rounded-2xl border border-amber-200/50 shadow-inner">
                                            <input 
                                                type="text" 
                                                placeholder="Voucher Code"
                                                className="w-full text-center tracking-widest font-mono font-bold text-lg bg-white border border-stone-300 focus:border-amber-400 focus:ring-amber-400 rounded-xl py-3 px-4 shadow-sm"
                                                value={voucherForm.data.code}
                                                onChange={e => voucherForm.setData('code', e.target.value.toUpperCase())}
                                                required
                                            />
                                        </div>
                                     </div>

                                     <div className="pt-4 pb-2">
                                        <button 
                                            type="submit"
                                            disabled={!voucherForm.data.code || voucherForm.processing}
                                            className="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-stone-300 text-white font-extrabold py-3.5 px-4 rounded-2xl transition-colors shadow-md shadow-amber-400/20"
                                        >
                                            {voucherForm.processing ? 'VERIFYING...' : 'CONFIRM VOUCHER CODE'}
                                        </button>
                                     </div>
                                </form>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
