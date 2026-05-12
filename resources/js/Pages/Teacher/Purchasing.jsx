import { useState } from 'react';
import { Head } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import Modal from '@/Components/Modal';

export default function Purchasing({ shells }) {
    const [selectedShell, setSelectedShell] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePurchase = () => {
        // Mock checkout flow
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            setIsCheckoutOpen(false);
            setSelectedShell(null);
            setQuantity(1);
        }, 3000);
    };

    return (
        <TeacherLayout>
            <Head title="Bulk Purchasing - Teacher Dashboard" />

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-stone-900">Bulk Purchasing</h2>
                    <p className="text-stone-500 mt-1">Browse available Shells (Certification Courses) and purchase access vouchers for your cohorts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shells.map((shell) => (
                        <div key={shell.id} className="border border-stone-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col">
                            <div className="h-48 overflow-hidden bg-stone-100">
                                <img src={shell.thumbnail} alt={shell.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-stone-900 leading-tight">{shell.title}</h3>
                                </div>
                                <p className="text-stone-500 text-sm mb-4 line-clamp-2 flex-1">{shell.description}</p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                                    <span className="text-xl font-black text-amber-600">${shell.price}</span>
                                    <button 
                                        onClick={() => {
                                            setSelectedShell(shell);
                                            setIsCheckoutOpen(true);
                                        }}
                                        className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                                    >
                                        Buy Vouchers
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal show={isCheckoutOpen} onClose={() => !isSuccess && setIsCheckoutOpen(false)} maxWidth="md">
                <div className="p-6">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                ✓
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mb-2">Purchase Successful!</h3>
                            <p className="text-stone-500">
                                You have successfully purchased {quantity} vouchers for <br/>
                                <span className="font-semibold text-stone-700">{selectedShell?.title}</span>.
                            </p>
                            <p className="text-sm text-stone-400 mt-4">Generating vouchers...</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-stone-900 mb-6">Purchase Vouchers</h2>
                            
                            {selectedShell && (
                                <div className="mb-6 bg-stone-50 p-4 rounded-xl border border-stone-100">
                                    <h4 className="font-bold text-stone-800">{selectedShell.title}</h4>
                                    <p className="text-stone-500 text-sm mt-1">${selectedShell.price} per student</p>
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-stone-700 mb-2">Number of Vouchers (Cohort Size)</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="100" 
                                    value={quantity} 
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full border-stone-300 rounded-xl focus:border-amber-500 focus:ring-amber-500 shadow-sm"
                                />
                            </div>

                            <div className="mb-8 border-t border-stone-200 pt-4">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span className="text-stone-700">Total Price:</span>
                                    <span className="text-amber-600">${(selectedShell?.price * quantity).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={() => setIsCheckoutOpen(false)}
                                    className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handlePurchase}
                                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl font-bold transition-colors shadow-sm shadow-amber-500/20"
                                >
                                    Confirm Purchase
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </TeacherLayout>
    );
}
