import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Student/MarketplaceController.php @ show
 * Required Props:
 * 1. shell: { id, title, description, price, creator_name, thumbnail, features: [], modules_count }
 * 2. modules: Array of module titles for the curriculum preview.
 * * Enrollment Endpoints to wire up to the router.post calls below:
 * A) route('student.enrollment.voucher') -> Validates voucher, attaches shell, returns JSON success or validation error.
 * B) route('student.enrollment.checkout') -> Creates Xendit invoice, returns Xendit checkout URL.
 * ==============================================================================
 */

export default function MarketplaceShow({ auth, shell, modules = [] }) {
    // --- MODAL STATE MANAGEMENT ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Steps: 'select_method', 'voucher_input', 'processing', 'success'
    const [modalStep, setModalStep] = useState('select_method'); 
    
    // Form Data
    const [selectedMethod, setSelectedMethod] = useState('');
    const [voucherCode, setVoucherCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const openModal = () => {
        setModalStep('select_method');
        setErrorMessage('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (modalStep === 'processing') return; // Prevent closing while processing
        setIsModalOpen(false);
    };

    // Handle E-Wallet/Card Checkout (Xendit)
    const handleCheckout = (method) => {
        setModalStep('processing');
        // Mike & Ahmad: This should hit your Xendit creation endpoint
        router.post(route('student.enrollment.checkout'), { shell_id: shell.id, method: method }, {
            onError: () => {
                setErrorMessage("Unable to connect to payment gateway.");
                setModalStep('select_method');
            },
            // If Xendit redirects, Inertia handles it. If it returns a URL, handle it here.
        });
    };

    // Handle Voucher Application
    const handleVoucherSubmit = (e) => {
        e.preventDefault();
        if (!voucherCode) return;
        
        setModalStep('processing');
        setErrorMessage('');

        router.post(route('student.enrollment.voucher'), { shell_id: shell.id, code: voucherCode }, {
            onSuccess: () => {
                setModalStep('success');
            },
            onError: (errors) => {
                // Catches Laravel Validation Errors
                setErrorMessage(errors.code || "Invalid or expired voucher code.");
                setModalStep('voucher_input');
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={shell?.title || 'Shell Details'} />

            <div className="min-h-screen bg-[#FDFCFB] pb-24 selection:bg-orange-500 selection:text-white">
                
                {/* Minimal Breadcrumb Header */}
                <div className="bg-white border-b border-stone-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                        <Link href={route('marketplace.index')} className="text-sm font-bold text-stone-400 hover:text-stone-900 transition-colors">
                            &larr; Back to Shop
                        </Link>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    <div className="flex flex-col lg:flex-row gap-12 relative">
                        
                        {/* LEFT COLUMN: Shell Details */}
                        <div className="w-full lg:w-2/3">
                            <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-[1.1] mb-6">
                                {shell?.title || "Complete React.js Certification"}
                            </h1>
                            
                            <p className="text-xl text-stone-500 font-medium mb-8 leading-relaxed">
                                {shell?.description || "Master modern web development. Learn hooks, state management, and build interactive user interfaces to earn your Sandbox Certification."}
                            </p>

                            <div className="flex items-center gap-4 mb-12 pb-12 border-b border-stone-200">
                                <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center text-xl">👤</div>
                                <div>
                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Created By</p>
                                    <p className="font-black text-stone-900">{shell?.creator_name || "Sandbox Official"}</p>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-stone-900 mb-6">Curriculum Overview</h3>
                            <div className="space-y-4 mb-12">
                                {modules.length > 0 ? modules.map((mod, idx) => (
                                    <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                                            {idx + 1}
                                        </div>
                                        <span className="font-bold text-stone-700 text-lg">{mod.title}</span>
                                    </div>
                                )) : (
                                    <p className="text-stone-500 italic">Curriculum details loading...</p>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sticky Enrollment Card */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-white rounded-[2rem] border border-stone-200 shadow-xl shadow-stone-200/50 sticky top-24 overflow-hidden">
                                <div className="h-56 bg-stone-100 relative">
                                    {shell?.thumbnail ? (
                                        <img src={shell.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 text-6xl">🐚</div>
                                    )}
                                </div>
                                <div className="p-8 text-center">
                                    <div className="text-4xl font-black text-stone-900 mb-6">
                                        ₱ {shell?.price || "1,500.00"}
                                    </div>
                                    <button 
                                        onClick={openModal}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-lg py-4 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-1 mb-4"
                                    >
                                        Enroll Now
                                    </button>
                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                                        14-Day Money Back Guarantee
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ENROLLMENT MODAL OVERLAY */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animation-fade-in">
                    <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative">
                        
                        {/* Close Button */}
                        {modalStep !== 'processing' && modalStep !== 'success' && (
                            <button onClick={closeModal} className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 transition-colors">
                                ✕
                            </button>
                        )}

                        <div className="p-8 md:p-10">
                            
                            {/* STEP 1: SELECT PAYMENT METHOD */}
                            {modalStep === 'select_method' && (
                                <>
                                    <h3 className="text-2xl font-black text-stone-900 mb-2">Complete Enrollment</h3>
                                    <p className="text-stone-500 font-medium mb-8">Choose how you'd like to pay for <strong>{shell?.title}</strong>.</p>
                                    
                                    <div className="space-y-3">
                                        <button onClick={() => handleCheckout('gcash')} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-stone-100 hover:border-blue-500 hover:bg-blue-50 transition-colors group">
                                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-black">G</div>
                                            <span className="font-bold text-stone-700 group-hover:text-blue-900 text-lg">Pay with GCash</span>
                                        </button>
                                        <button onClick={() => handleCheckout('maya')} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-stone-100 hover:border-green-500 hover:bg-green-50 transition-colors group">
                                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 font-black">M</div>
                                            <span className="font-bold text-stone-700 group-hover:text-green-900 text-lg">Pay with Maya</span>
                                        </button>
                                        <div className="py-4 flex items-center text-stone-300">
                                            <div className="flex-1 border-t border-stone-200"></div>
                                            <span className="px-4 text-xs font-bold uppercase tracking-widest text-stone-400">OR</span>
                                            <div className="flex-1 border-t border-stone-200"></div>
                                        </div>
                                        <button onClick={() => setModalStep('voucher_input')} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-stone-100 hover:border-orange-500 hover:bg-orange-50 transition-colors group">
                                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-black text-xl">🎟️</div>
                                            <div className="text-left">
                                                <span className="block font-bold text-stone-700 group-hover:text-orange-900 text-lg">Apply Voucher Code</span>
                                                <span className="block text-xs font-bold text-stone-400">Institutional or Creator codes</span>
                                            </div>
                                        </button>
                                    </div>
                                    {errorMessage && <p className="text-red-500 text-sm font-bold mt-6 text-center">{errorMessage}</p>}
                                </>
                            )}

                            {/* STEP 2: VOUCHER INPUT */}
                            {modalStep === 'voucher_input' && (
                                <>
                                    <button onClick={() => setModalStep('select_method')} className="text-stone-400 hover:text-stone-900 text-sm font-bold mb-6">&larr; Back</button>
                                    <h3 className="text-2xl font-black text-stone-900 mb-2">Enter Voucher Code</h3>
                                    <p className="text-stone-500 font-medium mb-8">If your teacher or institution provided a code, enter it below to bypass payment.</p>
                                    
                                    <form onSubmit={handleVoucherSubmit}>
                                        <input 
                                            type="text" 
                                            value={voucherCode}
                                            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                            placeholder="e.g. NU-TECH-2026"
                                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-4 text-center font-black text-2xl tracking-widest text-stone-900 focus:border-orange-500 focus:ring-orange-500 mb-2 uppercase placeholder:text-stone-300 placeholder:font-medium placeholder:tracking-normal"
                                            autoFocus
                                        />
                                        {errorMessage && <p className="text-red-500 text-sm font-bold mb-6 text-center">{errorMessage}</p>}
                                        
                                        <button type="submit" disabled={!voucherCode} className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-black text-lg py-4 rounded-xl shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50">
                                            Apply & Enroll
                                        </button>
                                    </form>
                                </>
                            )}

                            {/* STEP 3: PROCESSING */}
                            {modalStep === 'processing' && (
                                <div className="text-center py-12">
                                    <div className="inline-block w-16 h-16 border-4 border-stone-100 border-t-orange-500 rounded-full animate-spin mb-6"></div>
                                    <h3 className="text-2xl font-black text-stone-900 mb-2">Processing...</h3>
                                    <p className="text-stone-500 font-medium">Please do not close this window.</p>
                                </div>
                            )}

                            {/* STEP 4: SUCCESS */}
                            {modalStep === 'success' && (
                                <div className="text-center py-8">
                                    <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-inner">✓</div>
                                    <h3 className="text-3xl font-black text-stone-900 mb-2">Enrolled Successfully!</h3>
                                    <p className="text-stone-500 font-medium mb-10">You are now ready to start your certification journey.</p>
                                    
                                    <Link href={route('student.shells.index')} className="block w-full bg-stone-900 hover:bg-orange-500 text-white font-black text-lg py-4 rounded-xl shadow-lg transition-colors">
                                        Go to My Shells
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}