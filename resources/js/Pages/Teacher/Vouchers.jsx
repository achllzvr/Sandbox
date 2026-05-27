import { useState } from 'react';
import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Vouchers({ vouchers = [] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVouchers = vouchers.filter(v => 
        v.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
        v.shell.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.student && v.student.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        alert(`Voucher ${code} copied to clipboard! 🏖️`);
    };

    return (
        <TeacherLayout>
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

            {/* Table Container */}
            <div className="bg-[#FFFDF6] border-4 border-[#5C4033] rounded-[28px] p-6 md:p-8 shadow-[8px_8px_0px_#5C4033]">
                <div className="overflow-x-auto border-2 border-[#5C4033] rounded-2xl bg-[#FDF6E2]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-[#5C4033] bg-[#F5EFCF] text-[#5C4033] font-black text-xs uppercase tracking-wider">
                                <th className="py-4 px-6 border-r-2 border-[#5C4033]">Voucher Code</th>
                                <th className="py-4 px-6 border-r-2 border-[#5C4033]">Shell (Course)</th>
                                <th className="py-4 px-6 border-r-2 border-[#5C4033]">Status</th>
                                <th className="py-4 px-6">Student / Redeemed At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-[#5C4033]/30 text-sm font-semibold text-[#5C4033]">
                            {filteredVouchers.length > 0 ? (
                                filteredVouchers.map((voucher) => (
                                    <tr key={voucher.id} className="hover:bg-[#F5EFCF]/40 transition-colors">
                                        <td className="py-4 px-6 border-r-2 border-[#5C4033]">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono font-bold text-[#5C4033] bg-[#FFFDF6] border-2 border-[#5C4033] px-3 py-1.5 rounded-xl text-sm shadow-[2px_2px_0px_#5C4033]">
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
                                        <td className="py-4 px-6 border-r-2 border-[#5C4033] font-bold">
                                            {voucher.shell}
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-12 px-6 text-center text-[#8B6C58] font-bold">
                                        <div className="text-3xl mb-2">🐚</div>
                                        No vouchers found. If you need codes, check out the shop to purchase bulk vouchers!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </TeacherLayout>
    );
}
