import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CreatorLayout from '@/Layouts/CreatorLayout';
import TextInput from '@/Components/TextInput';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Creator/WalletController.php @ index
 * Required Props:
 * 1. balance: float (Current withdrawable amount)
 * 2. lifetime_earnings: float
 * 3. ledger: Array of { id, date, description, amount, type: 'credit' | 'debit', status }
 * * Withdraw Endpoint: route('creator.wallet.withdraw')
 * Payload: { amount, method, account_number, account_name }
 * ==============================================================================
 */

export default function CreatorWallet({ auth, balance = 24500.00, lifetime_earnings = 150000.00, ledger = [] }) {
    const { data, setData, post, processing, reset } = useForm({
        amount: '',
        method: 'gcash', // gcash, maya, bank
        account_number: '',
        account_name: '',
    });

    const [statusMessage, setStatusMessage] = useState('');

    const setMaxAmount = () => {
        setData('amount', balance.toString());
    };

    const submitWithdrawal = (e) => {
        e.preventDefault();
        post(route('creator.wallet.withdraw'), {
            onSuccess: () => {
                setStatusMessage('Withdrawal request submitted successfully.');
                reset();
            }
        });
    };

    return (
        <CreatorLayout user={auth.user} header={<h2 className="font-black text-2xl text-stone-900 tracking-tighter">Wallet & Payouts</h2>}>
            <Head title="Creator Wallet" />

            <div className="py-8 bg-[#F9F8F6] min-h-screen selection:bg-orange-500 selection:text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Master KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-stone-900 text-white rounded-[2rem] p-8 shadow-xl shadow-stone-900/10 relative overflow-hidden">
                            <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="relative z-10">
                                <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">Available Balance</p>
                                <p className="text-4xl md:text-5xl font-black tracking-tight">₱ {balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm flex flex-col justify-center">
                            <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">Lifetime Earnings</p>
                            <p className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight">₱ {lifetime_earnings.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                        </div>
                    </div>

                    {/* 60/40 SPLIT LAYOUT */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        
                        {/* LEFT: Earnings History / Ledger (60%) */}
                        <div className="w-full lg:w-3/5">
                            <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden h-full flex flex-col">
                                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                                    <h3 className="text-xl font-black text-stone-900">Earnings History</h3>
                                    <button className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">Download CSV</button>
                                </div>
                                
                                <div className="overflow-x-auto flex-grow">
                                    {ledger.length > 0 ? (
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-white border-b border-stone-200 text-xs font-black text-stone-400 uppercase tracking-widest">
                                                    <th className="p-5">Date</th>
                                                    <th className="p-5">Description</th>
                                                    <th className="p-5 text-center">Status</th>
                                                    {/* Right Aligned Currency Header */}
                                                    <th className="p-5 text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-stone-100">
                                                {ledger.map((entry, idx) => (
                                                    <tr key={idx} className="hover:bg-stone-50 transition-colors">
                                                        <td className="p-5 text-sm font-medium text-stone-500">{entry.date}</td>
                                                        <td className="p-5 font-bold text-stone-900">{entry.description}</td>
                                                        <td className="p-5 text-center">
                                                            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${entry.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                {entry.status}
                                                            </span>
                                                        </td>
                                                        {/* Right Aligned Currency Data */}
                                                        <td className={`p-5 text-right font-black ${entry.type === 'credit' ? 'text-green-600' : 'text-stone-900'}`}>
                                                            {entry.type === 'credit' ? '+' : '-'} ₱{entry.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                                            <div className="text-4xl mb-3 opacity-50">🧾</div>
                                            <p className="font-bold text-stone-500">Your ledger is currently empty.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Withdrawal Form (40%) */}
                        <div className="w-full lg:w-2/5">
                            <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm p-6 sm:p-8">
                                <h3 className="text-xl font-black text-stone-900 mb-6">Request Withdrawal</h3>
                                
                                {statusMessage && (
                                    <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-bold flex items-center gap-2">
                                        <span>✓</span> {statusMessage}
                                    </div>
                                )}

                                <form onSubmit={submitWithdrawal} className="space-y-6">
                                    
                                    {/* Amount Input with MAX Button */}
                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-1.5">Amount to Withdraw</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-stone-400 font-bold text-lg">₱</span>
                                            <TextInput
                                                type="number"
                                                step="0.01"
                                                max={balance}
                                                value={data.amount}
                                                onChange={(e) => setData('amount', e.target.value)}
                                                className="w-full pl-10 pr-20 py-4 bg-stone-50 focus:bg-white border-stone-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl font-black text-xl text-stone-900"
                                                placeholder="0.00"
                                                required
                                            />
                                            {/* THE MAX BUTTON */}
                                            <button 
                                                type="button"
                                                onClick={setMaxAmount}
                                                className="absolute right-3 bg-stone-200 hover:bg-stone-300 text-stone-600 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Max
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-1.5">Transfer Method</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                type="button" 
                                                onClick={() => setData('method', 'gcash')}
                                                className={`p-3 rounded-xl border-2 font-bold transition-all ${data.method === 'gcash' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-stone-100 text-stone-500 hover:border-stone-200'}`}
                                            >
                                                GCash
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => setData('method', 'bank')}
                                                className={`p-3 rounded-xl border-2 font-bold transition-all ${data.method === 'bank' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-stone-100 text-stone-500 hover:border-stone-200'}`}
                                            >
                                                Bank Transfer
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-1.5">Account Name</label>
                                        <TextInput
                                            type="text"
                                            value={data.account_name}
                                            onChange={(e) => setData('account_name', e.target.value)}
                                            className="w-full bg-stone-50 focus:bg-white border-stone-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                                            placeholder="Juan Dela Cruz"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-1.5">Account / Mobile Number</label>
                                        <TextInput
                                            type="text"
                                            value={data.account_number}
                                            onChange={(e) => setData('account_number', e.target.value)}
                                            className="w-full bg-stone-50 focus:bg-white border-stone-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl font-mono"
                                            placeholder="0912 345 6789"
                                            required
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={processing || !data.amount || parseFloat(data.amount) > balance}
                                        className="w-full bg-stone-900 hover:bg-orange-500 text-white font-black text-lg py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 active:scale-95"
                                    >
                                        {processing ? 'Processing...' : 'Confirm Withdrawal'}
                                    </button>
                                    
                                    <p className="text-center text-xs font-bold text-stone-400 mt-4">
                                        Payouts are processed within 1-3 business days.
                                    </p>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </CreatorLayout>
    );
}