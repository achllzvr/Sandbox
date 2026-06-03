import { useState, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import Modal from '@/Components/Modal';

export default function Purchasing({ shells }) {
    const [selectedShell, setSelectedShell] = useState(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTech, setSelectedTech] = useState('All');
    const [sortBy, setSortBy] = useState('low-to-high');

    const [checkoutStep, setCheckoutStep] = useState(1);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [refundsAccepted, setRefundsAccepted] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        certification_id: '',
        quantity: 1,
    });

    const handleConfirmPurchase = (e) => {
        e.preventDefault();
        post(route('teacher.checkout.bulk'), {
            onSuccess: () => {
                setIsCheckoutOpen(false);
                setSelectedShell(null);
                setCheckoutStep(1);
                setTermsAccepted(false);
                setRefundsAccepted(false);
                reset();
            },
        });
    };

    // Filter and sort the certifications/shells dynamically
    const filteredAndSortedShells = useMemo(() => {
        let result = [...shells];

        // 1. Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (s) =>
                    s.title.toLowerCase().includes(query) ||
                    (s.description && s.description.toLowerCase().includes(query))
            );
        }

        // 2. Tech filter
        if (selectedTech !== 'All') {
            result = result.filter((s) => {
                const title = s.title.toLowerCase();
                if (selectedTech === 'Laravel') return title.includes('laravel');
                if (selectedTech === 'React') return title.includes('react');
                if (selectedTech === 'HTML') return title.includes('html');
                return true;
            });
        }

        // 3. Sorting filter
        if (sortBy === 'low-to-high') {
            result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortBy === 'high-to-low') {
            result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        } else if (sortBy === 'alphabetical') {
            result.sort((a, b) => a.title.localeCompare(b.title));
        }

        return result;
    }, [shells, searchQuery, selectedTech, sortBy]);

    // Helper to resolve card background color and tech logo icon
    const getTechTheme = (title = '') => {
        const lower = title.toLowerCase();
        if (lower.includes('laravel')) {
            return {
                bg: 'bg-[#EBF7EB]', // soft light green
                bannerBg: 'bg-[#77DD77]', // primary green
                bannerText: 'text-[#225522]',
                techIcon: '🍎', // Laravel logo placeholder or cute apple/red icon
                accentColor: '#77DD77',
            };
        } else if (lower.includes('react')) {
            return {
                bg: 'bg-[#E6F0FA]', // soft light blue
                bannerBg: 'bg-[#89A8FF]', // primary blue
                bannerText: 'text-[#112255]',
                techIcon: '⚛️', // React logo symbol
                accentColor: '#89A8FF',
            };
        } else if (lower.includes('html')) {
            return {
                bg: 'bg-[#FFF2E6]', // soft light orange
                bannerBg: 'bg-[#FFB366]', // primary orange
                bannerText: 'text-[#552211]',
                techIcon: '🔥', // HTML logo symbol or flame
                accentColor: '#FFB366',
            };
        }
        return {
            bg: 'bg-[#F5EFCF]', // default soft yellow
            bannerBg: 'bg-[#F9DCA2]', // default amber
            bannerText: 'text-[#5C4033]',
            techIcon: '🐚', // general shell symbol
            accentColor: '#F9DCA2',
        };
    };

    return (
        <TeacherLayout activeNav="purchasing">
            <Head title="Shop - Teacher Portal" />

            {/* Header section */}
            <div className="mb-8">
                <span className="bubble-text text-4xl text-[#E2725B] tracking-tight block">
                    MY SHELLS
                </span>
                <p className="text-[#8B6C58] font-bold mt-1 uppercase text-xs tracking-wider">
                    Browse the available certificates for taking!
                </p>
            </div>

            {/* Search and Filters Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-10 items-stretch">
                {/* Search box */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search certifications..."
                    className="w-full md:flex-1 bg-[#FFFDF6] border-2 border-[#5C4033] rounded-full py-2.5 px-5 shadow-[2px_2px_0px_#5C4033] placeholder-[#8B6C58]/60 text-[#5C4033] font-bold focus:outline-none focus:ring-0 text-sm"
                />

                {/* Technology Filter */}
                <select
                    value={selectedTech}
                    onChange={(e) => setSelectedTech(e.target.value)}
                    className="bg-[#FFFDF6] border-2 border-[#5C4033] rounded-full py-2.5 px-5 shadow-[2px_2px_0px_#5C4033] text-[#5C4033] font-bold focus:outline-none text-sm cursor-pointer"
                >
                    <option value="All">All Technologies</option>
                    <option value="Laravel">Laravel</option>
                    <option value="React">React</option>
                    <option value="HTML">HTML</option>
                </select>

                {/* Sorting Filter */}
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#FFFDF6] border-2 border-[#5C4033] rounded-full py-2.5 px-5 shadow-[2px_2px_0px_#5C4033] text-[#5C4033] font-bold focus:outline-none text-sm cursor-pointer"
                >
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                    <option value="alphabetical">Alphabetical</option>
                </select>
            </div>

            {/* Grid of Certifications */}
            {filteredAndSortedShells.length === 0 ? (
                <div className="text-center py-20 bg-[#FFFDF6] border-4 border-[#5C4033] rounded-[28px] shadow-[6px_6px_0px_#5C4033]">
                    <span className="text-5xl">🌴</span>
                    <h3 className="text-xl font-black text-[#5C4033] mt-4">No Certification Shells Found</h3>
                    <p className="text-[#8B6C58] text-sm font-semibold mt-1">
                        Try tweaking your filters or search terms to find available courses.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAndSortedShells.map((shell) => {
                        const theme = getTechTheme(shell.title);
                        return (
                            <div
                                key={shell.id}
                                className="bg-[#FFFDF6] border-4 border-[#5C4033] rounded-[24px] overflow-hidden shadow-[6px_6px_0px_#5C4033] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#5C4033] transition-all flex flex-col h-full"
                            >
                                {/* Top Tech Icon Graphic */}
                                <div className={`h-40 border-b-4 border-[#5C4033] ${theme.bg} flex items-center justify-center relative overflow-hidden`}>
                                    <span className="text-7xl drop-shadow-md select-none transform hover:scale-110 transition-transform duration-300">
                                        {theme.techIcon}
                                    </span>
                                </div>

                                {/* Title Banner Block */}
                                <div className={`${theme.bannerBg} ${theme.bannerText} py-3 px-4 border-b-2 border-[#5C4033] text-center`}>
                                    <h4 className="font-black text-sm uppercase tracking-wide truncate">
                                        {shell.title}
                                    </h4>
                                </div>

                                {/* Body Description Block */}
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <span className="text-[#8B6C58] font-black text-[10px] uppercase tracking-wider block mb-1">
                                            Professional Certificate
                                        </span>
                                        <p className="text-[#6E5042] text-xs font-semibold line-clamp-3 mb-4 leading-relaxed">
                                            {shell.description || "An intensive, cohort-ready certificate designed to assess and certify industry-level core competency."}
                                        </p>
                                    </div>

                                    {/* Action Row */}
                                    <div className="flex items-center justify-between pt-4 border-t-2 border-[#5C4033]/15">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-[#8B6C58] uppercase">Price</span>
                                            <span className="text-xl font-black text-[#E2725B] font-mono tracking-tight">
                                                ₱{parseFloat(shell.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedShell(shell);
                                                setData({
                                                    certification_id: shell.id,
                                                    quantity: 5, // default to 5 vouchers
                                                });
                                                clearErrors();
                                                setIsCheckoutOpen(true);
                                            }}
                                            className="bg-[#FFFDF6] hover:bg-[#F5EFCF] text-[#5C4033] border-2 border-[#5C4033] font-black text-xs uppercase px-4 py-2.5 rounded-xl shadow-[3px_3px_0px_#5C4033] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[1px_1px_0px_#5C4033] transition-all cursor-pointer"
                                        >
                                            Buy Vouchers
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Custom Outline Checkout Modal */}
            <Modal show={isCheckoutOpen} onClose={() => !processing && setIsCheckoutOpen(false)} maxWidth="md">
                <div className="bg-[#FFFDF6] border-4 border-[#5C4033] rounded-[32px] p-6 md:p-8 shadow-[8px_8px_0px_#5C4033] text-[#5C4033] relative">
                    
                    {/* Back Button for Step 2 */}
                    {checkoutStep === 2 && (
                        <button
                            type="button"
                            onClick={() => setCheckoutStep(1)}
                            className="absolute top-6 left-6 text-2xl font-black text-[#5C4033] hover:text-[#E2725B] transition-colors"
                            title="Back"
                        >
                            ←
                        </button>
                    )}

                    {checkoutStep === 1 ? (
                        <>
                            <div className="mb-6">
                                <span className="bubble-text text-3xl text-[#E2725B] tracking-tight block">
                                    CHECKOUT
                                </span>
                                <p className="text-[#8B6C58] font-bold uppercase text-[10px] tracking-wider mt-1">
                                    B2B Teacher Bulk Voucher Provisioning
                                </p>
                            </div>

                            {errors.checkout && (
                                <div className="mb-4 bg-[#FFEBE6] text-[#E2725B] text-xs font-bold py-2.5 px-4 rounded-xl border-2 border-[#E2725B] shadow-[2px_2px_0px_#E2725B]">
                                    ⚠️ {errors.checkout}
                                </div>
                            )}
                            {errors.certification_id && (
                                <div className="mb-4 bg-[#FFEBE6] text-[#E2725B] text-xs font-bold py-2.5 px-4 rounded-xl border-2 border-[#E2725B] shadow-[2px_2px_0px_#E2725B]">
                                    ⚠️ {errors.certification_id}
                                </div>
                            )}
                            {errors.quantity && (
                                <div className="mb-4 bg-[#FFEBE6] text-[#E2725B] text-xs font-bold py-2.5 px-4 rounded-xl border-2 border-[#E2725B] shadow-[2px_2px_0px_#E2725B]">
                                    ⚠️ {errors.quantity}
                                </div>
                            )}

                            {selectedShell && (
                                <div className="mb-6 bg-[#F5EFCF] p-4 rounded-2xl border-2 border-[#5C4033] shadow-[3px_3px_0px_#5C4033]">
                                    <h4 className="font-black text-sm uppercase tracking-wider text-[#5C4033]">
                                        {selectedShell.title}
                                    </h4>
                                    <p className="text-xs font-semibold text-[#8B6C58] mt-1">
                                        ₱{parseFloat(selectedShell.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per voucher
                                    </p>
                                </div>
                            )}

                            <form onSubmit={(e) => { e.preventDefault(); setCheckoutStep(2); }}>
                                <div className="mb-6">
                                    <label className="block text-xs font-black uppercase text-[#8B6C58] tracking-wider mb-2">
                                        Number of Vouchers (Cohort Size)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={data.quantity}
                                        onChange={(e) => setData('quantity', Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-full bg-[#FFFDF6] border-2 border-[#5C4033] rounded-xl py-2 px-4 shadow-[2px_2px_0px_#5C4033] focus:outline-none focus:ring-0 font-bold text-sm"
                                        disabled={processing}
                                        required
                                    />
                                </div>

                                {/* Calculated price block */}
                                <div className="mb-8 border-t-2 border-dashed border-[#5C4033] pt-4 flex justify-between items-center">
                                    <span className="font-black uppercase text-xs tracking-wider text-[#8B6C58]">
                                        Total Amount:
                                    </span>
                                    <span className="text-2xl font-black text-[#E2725B] font-mono tracking-tight">
                                        ₱{((selectedShell?.price || 0) * data.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>

                                {/* Actions block */}
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsCheckoutOpen(false)}
                                        className="px-5 py-2.5 text-xs font-bold text-[#8B6C58] hover:bg-[#F5EFCF] rounded-xl border-2 border-transparent transition-all uppercase"
                                        disabled={processing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-[#E2725B] hover:bg-[#D45D43] disabled:bg-[#F5EFCF] text-white border-2 border-[#5C4033] font-black text-xs uppercase px-6 py-2.5 rounded-xl shadow-[3px_3px_0px_#5C4033] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
                                    >
                                        Next
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <span className="bubble-text text-3xl text-[#E2725B] tracking-tight block text-center mt-2 mb-6">
                                YOU ARE ENROLLING
                            </span>

                            {selectedShell && (
                                <div className="bg-[#5E7AE6] text-white border-2 border-[#5C4033] rounded-[24px] p-5 shadow-[4px_4px_0px_#5C4033] mb-8 text-center flex flex-col items-center justify-center relative min-h-[90px]">
                                    <span className="font-black text-lg tracking-tight uppercase leading-tight">
                                        {selectedShell.title} <span className="text-sm">✓</span>
                                    </span>
                                    <span className="text-[#D0D7FF] font-bold text-[10px] uppercase tracking-wider block mt-1">
                                        Professional Certificate
                                    </span>
                                </div>
                            )}

                            <form onSubmit={handleConfirmPurchase}>
                                <div className="space-y-5 mb-8">
                                    {/* Checkbox 1 */}
                                    <label className="flex items-start gap-4 cursor-pointer select-none group text-xs text-[#5C4033] font-semibold leading-relaxed">
                                        <div className="relative mt-0.5 shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={refundsAccepted}
                                                onChange={(e) => setRefundsAccepted(e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-6 h-6 rounded border-2 border-[#5C4033] transition-all flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_#5C4033] ${
                                                refundsAccepted ? 'bg-[#77DD77] text-[#5C4033]' : 'bg-[#FFFDF6] text-transparent'
                                            }`}>
                                                ✓
                                            </div>
                                        </div>
                                        <span className="pt-0.5">
                                            Do you understand that this action is <strong className="font-black text-[#5C4033]">irreversible</strong> and <strong className="font-black text-[#5C4033]">refunds are not allowed</strong>?
                                        </span>
                                    </label>

                                    {/* Checkbox 2 */}
                                    <label className="flex items-start gap-4 cursor-pointer select-none group text-xs text-[#5C4033] font-semibold leading-relaxed">
                                        <div className="relative mt-0.5 shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={termsAccepted}
                                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-6 h-6 rounded border-2 border-[#5C4033] transition-all flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_#5C4033] ${
                                                termsAccepted ? 'bg-[#77DD77] text-[#5C4033]' : 'bg-[#FFFDF6] text-transparent'
                                            }`}>
                                                ✓
                                            </div>
                                        </div>
                                        <span className="pt-0.5">
                                            Do you accept the <strong className="font-black text-[#5C4033]">Terms of Service</strong> and you allow Sandbox to process your data with respect to the <strong className="font-black text-[#5C4033]">Data Privacy Act of 2012</strong>?
                                        </span>
                                    </label>
                                </div>

                                {/* Actions Block */}
                                <div className="flex flex-col items-center">
                                    <button
                                        type="submit"
                                        disabled={processing || !termsAccepted || !refundsAccepted}
                                        className={`w-full max-w-[280px] py-3.5 rounded-full border-2 border-[#5C4033] font-black text-sm uppercase tracking-wider transition-all shadow-[4px_4px_0px_#5C4033] ${
                                            termsAccepted && refundsAccepted
                                                ? 'bg-[#5E7AE6] hover:bg-[#4C68D4] text-white hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[1px_1px_0px_#5C4033] cursor-pointer'
                                                : 'bg-[#E2DCC8] text-[#8B6C58] opacity-50 cursor-not-allowed shadow-none'
                                        }`}
                                    >
                                        {processing ? 'Redirecting...' : 'PROCEED'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </Modal>
        </TeacherLayout>
    );
}
