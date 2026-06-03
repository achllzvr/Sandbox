import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Vouchers({ vouchers = [], pendingRequests = [] }) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        alert(`Voucher ${code} copied to clipboard! 🏖️`);
    };

    // 1. Group active vouchers and pending requests by certification
    const certificationsMap = {};

    vouchers.forEach(v => {
        const certId = v.certification_id;
        if (!certificationsMap[certId]) {
            certificationsMap[certId] = {
                id: certId,
                title: v.shell,
                vouchers: [],
                pending: []
            };
        }
        certificationsMap[certId].vouchers.push(v);
    });

    pendingRequests.forEach(p => {
        const certId = p.certification_id;
        if (!certificationsMap[certId]) {
            certificationsMap[certId] = {
                id: certId,
                title: p.shell,
                vouchers: [],
                pending: []
            };
        }
        certificationsMap[certId].pending.push(p);
    });

    const groupedCertifications = Object.values(certificationsMap);

    // 2. Dynamic dual filter based on search input
    const filteredGrouped = groupedCertifications.map(cert => {
        const matchingVouchers = cert.vouchers.filter(v =>
            v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.shell.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (v.student && v.student.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        const matchingPending = cert.pending.filter(p =>
            p.shell.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.payment_reference.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const titleMatches = cert.title.toLowerCase().includes(searchTerm.toLowerCase());

        return {
            ...cert,
            vouchers: titleMatches ? cert.vouchers : matchingVouchers,
            pending: titleMatches ? cert.pending : matchingPending
        };
    }).filter(cert => cert.vouchers.length > 0 || cert.pending.length > 0);

    return (
        <TeacherLayout activeNav="vouchers">
            <Head title="Vouchers - Teacher Portal" />

            {/* Header Title */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="bubble-text text-4xl text-[#E2725B] tracking-tight block">
                        MY VOUCHERS
                    </span>
                    <p className="text-[#8B6C58] font-bold mt-1 uppercase text-xs tracking-wider">
                        View your purchased voucher codes and monitor redemption status.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search codes or students..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#FFFDF6] border-2 border-[#5C4033] rounded-full py-2 px-5 pl-10 shadow-[2px_2px_0px_#5C4033] text-[#5C4033] placeholder-[#8B6C58]/60 font-bold focus:outline-none focus:ring-0 text-sm w-full md:w-64"
                        />
                        <span className="absolute inset-y-0 left-3.5 flex items-center text-sm">
                            🔍
                        </span>
                    </div>
                </div>
            </div>

            {/* Success/Error Alerts */}
            {flash?.success && (
                <div className="mb-6 bg-[#EBF7EB] text-[#225522] border-4 border-[#5C4033] rounded-2xl p-4 shadow-[4px_4px_0px_#5C4033] font-bold text-sm">
                    🎉 {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 bg-[#FFEBE6] text-[#E2725B] border-4 border-[#5C4033] rounded-2xl p-4 shadow-[4px_4px_0px_#5C4033] font-bold text-sm">
                    ⚠️ {flash.error}
                </div>
            )}

            {/* Grouped Certifications List */}
            <div className="space-y-10">
                {filteredGrouped.length > 0 ? (
                    filteredGrouped.map((cert) => (
                        <div key={cert.id} className="bg-[#FFFDF6] border-4 border-[#5C4033] rounded-[28px] p-6 md:p-8 shadow-[8px_8px_0px_#5C4033]">
                            
                            {/* Certification Title Header */}
                            <div className="mb-6 pb-4 border-b-2 border-dashed border-[#5C4033]/25 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <span className="bubble-text text-3xl text-[#E2725B] tracking-tight block">
                                        {cert.title.toUpperCase()}
                                    </span>
                                    <p className="text-[#8B6C58] font-bold uppercase text-[10px] tracking-wider mt-1">
                                        Certification Course Vouchers & Orders
                                    </p>
                                </div>
                                
                                <div className="flex gap-2">
                                    <span className="inline-block bg-[#F9DCA2] text-[#5C4033] border-2 border-[#5C4033] font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg shadow-[2px_2px_0px_#5C4033]">
                                        {cert.vouchers.length} Vouchers
                                    </span>
                                    {cert.pending.length > 0 && (
                                        <span className="inline-block bg-[#FFB366] text-[#552211] border-2 border-[#5C4033] font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg shadow-[2px_2px_0px_#5C4033]">
                                            {cert.pending.length} Pending
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Pending Orders Sub-Section */}
                            {cert.pending.length > 0 && (
                                <div className="mb-8 bg-[#FDF6E2] border-2 border-[#5C4033] rounded-2xl p-4 md:p-6 shadow-[4px_4px_0px_#5C4033]">
                                    <span className="inline-block bg-[#FFB366] text-[#552211] border border-[#5C4033] font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-[1px_1px_0px_#5C4033] mb-3">
                                        Awaiting Xendit Payment
                                    </span>
                                    <h4 className="font-black text-sm uppercase tracking-wider text-[#E2725B] mb-2">
                                        Pending Purchases
                                    </h4>
                                    <p className="text-xs text-[#8B6C58] font-bold mb-4">
                                        Complete checkout in Xendit test mode. After payment, return here — vouchers sync via webhook or when you land with your payment reference.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 gap-4">
                                        {cert.pending.map((request) => (
                                            <div key={request.id} className="bg-[#FFFDF6] border border-[#5C4033] rounded-xl p-4">
                                                <div className="text-xs text-[#8B6C58] font-bold space-y-1">
                                                    <p>Quantity: <span className="text-[#5C4033] font-black">{request.quantity} vouchers</span></p>
                                                    <p>Total Price: <span className="text-[#E2725B] font-black">₱{parseFloat(request.amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
                                                    <p className="font-mono text-[10px] text-[#8B6C58]">Ref: {request.payment_reference}</p>
                                                    <p className="text-[10px] text-[#8B6C58]">Ordered: {request.requested_at}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Active Vouchers Table */}
                            {cert.vouchers.length > 0 ? (
                                <div className="overflow-x-auto border-2 border-[#5C4033] rounded-2xl bg-[#FDF6E2]">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[#5C4033] bg-[#F5EFCF] text-[#5C4033] font-black text-xs uppercase tracking-wider">
                                                <th className="py-4 px-6 border-r-2 border-[#5C4033] w-1/3">Voucher Code</th>
                                                <th className="py-4 px-6 border-r-2 border-[#5C4033] w-1/4">Status</th>
                                                <th className="py-4 px-6">Student / Redeemed At</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-2 divide-[#5C4033]/30 text-sm font-semibold text-[#5C4033]">
                                            {cert.vouchers.map((voucher) => (
                                                <tr key={voucher.id} className="hover:bg-[#F5EFCF]/40 transition-colors">
                                                    <td className="py-4 px-6 border-r-2 border-[#5C4033]">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-mono font-bold text-[#5C4033] bg-[#FFFDF6] border-2 border-[#5C4033] px-3 py-1.5 rounded-xl text-sm shadow-[2px_2px_0px_#5C4033] inline-block">
                                                                {voucher.code}
                                                            </span>
                                                            <button 
                                                                onClick={() => copyToClipboard(voucher.code)}
                                                                className="w-8 h-8 rounded-lg border-2 border-[#5C4033] bg-[#FFFDF6] flex items-center justify-center hover:bg-[#F5EFCF] transition-all cursor-pointer shadow-[1.5px_1.5px_0px_#5C4033] hover:translate-y-[-1px]"
                                                                title="Copy Code"
                                                            >
                                                                📋
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 border-r-2 border-[#5C4033]">
                                                        {voucher.status === 'claimed' ? (
                                                            <span className="inline-block bg-[#77DD77] text-white border-2 border-[#5C4033] font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-lg shadow-[2px_2px_0px_#5C4033]">
                                                                Claimed
                                                            </span>
                                                        ) : (
                                                            <span className="inline-block bg-[#F9DCA2] text-[#5C4033] border-2 border-[#5C4033] font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-lg shadow-[2px_2px_0px_#5C4033]">
                                                                Unclaimed
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        {voucher.status === 'claimed' ? (
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-[#5C4033]">{voucher.student}</span>
                                                                <span className="text-xs text-[#8B6C58] mt-0.5">{voucher.redeemed_at}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-[#8B6C58] italic font-medium">
                                                                🏖️ Waiting for redemption...
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-xs text-[#8B6C58] italic font-bold">
                                    🏖️ No generated vouchers for this certification yet.
                                </p>
                            )}

                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-[#FFFDF6] border-4 border-[#5C4033] rounded-[28px] shadow-[6px_6px_0px_#5C4033]">
                        <span className="text-5xl">🐚</span>
                        <h3 className="text-xl font-black text-[#5C4033] mt-4">
                            {searchTerm ? "No Matching Vouchers Found" : "No Vouchers Purchased Yet"}
                        </h3>
                        <p className="text-[#8B6C58] text-sm font-semibold mt-1">
                            {searchTerm ? "Try searching for a different voucher code or course title." : "Check out the shop and purchase voucher codes to register your cohort!"}
                        </p>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
