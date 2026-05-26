import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Teacher/VoucherController.php (or similar)
 * Required Props:
 * 1. vouchers: Array of { id, code, batch_name, shell_title, status: 'Claimed' | 'Unclaimed', claimed_by: string | null, claimed_at: date | null }
 * ==============================================================================
 */

export default function TeacherVouchers({ auth, vouchers = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Frontend Filtering logic
    const filteredVouchers = vouchers.filter(v => {
        const matchesSearch = v.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              v.batch_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (v.claimed_by && v.claimed_by.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        // In a real app, you might trigger a small toast notification here
        alert(`Voucher ${code} copied to clipboard!`);
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-black text-2xl text-stone-900 tracking-tighter">Voucher Management</h2>}>
            <Head title="Vouchers" />

            <div className="py-8 bg-[#FDFCFB] min-h-screen selection:bg-blue-500 selection:text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                        <div>
                            <p className="text-stone-500 text-lg font-medium">
                                Manage and distribute your purchased enrollment codes to your students.
                            </p>
                        </div>
                        <Link href={route('teacher.marketplace.index')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-colors shrink-0">
                            + Buy More Vouchers
                        </Link>
                    </div>

                    {/* Data Table Card */}
                    <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden">
                        
                        {/* Table Controls */}
                        <div className="p-6 border-b border-stone-200 bg-stone-50 flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="w-full md:w-96 relative">
                                <span className="absolute left-4 top-3 text-stone-400">🔍</span>
                                <input 
                                    type="text" 
                                    placeholder="Search by code, batch, or student..." 
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border-stone-200 focus:border-blue-500 focus:ring-blue-500 text-sm font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-auto flex gap-3">
                                <select 
                                    className="rounded-xl border-stone-200 focus:border-blue-500 focus:ring-blue-500 text-sm font-bold text-stone-600 w-full md:w-auto"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Unclaimed">Unclaimed (Ready)</option>
                                    <option value="Claimed">Claimed (Active)</option>
                                </select>
                                <button className="bg-white border-2 border-stone-200 hover:border-stone-300 text-stone-600 font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0">
                                    Export to CSV
                                </button>
                            </div>
                        </div>

                        {/* The Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-stone-50/50 border-b border-stone-200 text-xs font-black text-stone-400 uppercase tracking-widest">
                                        <th className="p-6 w-1/4">Voucher Code</th>
                                        <th className="p-6">Batch & Shell</th>
                                        <th className="p-6 text-center">Status</th>
                                        <th className="p-6">Assigned Student</th>
                                        <th className="p-6 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {filteredVouchers.length > 0 ? filteredVouchers.map((voucher, idx) => {
                                        const isClaimed = voucher.status === 'Claimed';
                                        
                                        return (
                                            <tr key={voucher.id || idx} className="hover:bg-stone-50/50 transition-colors">
                                                {/* Code Column */}
                                                <td className="p-6">
                                                    <div className="inline-flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
                                                        <span className={`font-mono font-black tracking-widest text-lg ${isClaimed ? 'text-stone-400 line-through' : 'text-stone-900'}`}>
                                                            {voucher.code}
                                                        </span>
                                                    </div>
                                                </td>
                                                
                                                {/* Batch Column */}
                                                <td className="p-6">
                                                    <p className="font-bold text-stone-900">{voucher.batch_name}</p>
                                                    <p className="text-xs font-medium text-stone-500">{voucher.shell_title}</p>
                                                </td>
                                                
                                                {/* Status Column */}
                                                <td className="p-6 text-center">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${isClaimed ? 'bg-stone-100 text-stone-500 border-stone-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                                                        {voucher.status}
                                                    </span>
                                                </td>
                                                
                                                {/* Assigned Student Column */}
                                                <td className="p-6">
                                                    {isClaimed ? (
                                                        <div>
                                                            <p className="font-bold text-stone-900">{voucher.claimed_by}</p>
                                                            <p className="text-xs font-medium text-stone-500">Claimed: {voucher.claimed_at}</p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-stone-400 italic text-sm font-medium">Awaiting Claim...</span>
                                                    )}
                                                </td>
                                                
                                                {/* Action Column */}
                                                <td className="p-6 text-right">
                                                    <button 
                                                        onClick={() => copyToClipboard(voucher.code)}
                                                        disabled={isClaimed}
                                                        className={`font-bold px-4 py-2 rounded-xl border-2 transition-all ${isClaimed ? 'border-stone-100 text-stone-300 cursor-not-allowed' : 'border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}
                                                    >
                                                        Copy Code
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan="5" className="p-12 text-center text-stone-500 font-medium">
                                                <div className="text-4xl mb-3">🎫</div>
                                                No vouchers match your filter criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}