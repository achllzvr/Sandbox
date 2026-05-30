import { useState } from 'react';
import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Vouchers({ vouchers }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVouchers = vouchers.filter(v => 
        v.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
        v.shell.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.student && v.student.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <TeacherLayout>
            <Head title="Voucher Tracking - Teacher Dashboard" />

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-stone-900">Voucher Tracking</h2>
                        <p className="text-stone-500 mt-1">View your purchased voucher codes and monitor redemption status.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                                🔍
                            </span>
                            <input 
                                type="text" 
                                placeholder="Search codes or students..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:ring-amber-500 focus:border-amber-500 shadow-sm text-sm w-full md:w-64"
                            />
                        </div>
                        <button className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors border border-stone-200">
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-stone-200">
                    <table className="min-w-full divide-y divide-stone-200">
                        <thead className="bg-stone-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">
                                    Voucher Code
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">
                                    Shell (Course)
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">
                                    Student / Redeemed At
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-stone-200">
                            {filteredVouchers.map((voucher) => (
                                <tr key={voucher.id} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-1 rounded-md text-sm border border-stone-200">
                                                {voucher.code}
                                            </span>
                                            <button 
                                                onClick={() => navigator.clipboard.writeText(voucher.code)}
                                                className="text-stone-400 hover:text-amber-600 transition-colors"
                                                title="Copy Code"
                                            >
                                                📋
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-stone-900">{voucher.shell}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            voucher.status === 'claimed' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {voucher.status === 'claimed' ? 'Claimed' : 'Unclaimed'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {voucher.status === 'claimed' ? (
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-stone-900">{voucher.student}</span>
                                                <span className="text-xs text-stone-500">{voucher.redeemed_at}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-stone-400 italic">Waiting for redemption...</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-amber-600 hover:text-amber-900 font-bold">
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredVouchers.length === 0 && (
                        <div className="p-8 text-center text-stone-500">
                            No vouchers found matching your search.
                        </div>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}
