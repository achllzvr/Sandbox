import { Head, Link, useForm } from '@inertiajs/react';
import CreatorLayout from '@/Layouts/CreatorLayout';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Creator/CertificationController.php @ create / store
 * Expected Payload on Submit:
 * { title, category, price, description }
 * Action: Create the initial database record, then redirect to the Shell Builder (Edit.jsx) 
 * so the creator can start adding modules.
 * ==============================================================================
 */

export default function CreatorShellCreate({ auth, categories = ['Programming', 'Design', 'Business', 'Marketing'] }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category: 'Programming',
        price: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Posts to backend, which should redirect to the builder (edit route) upon success
        post(route('creator.certifications.store'));
    };

    return (
        <CreatorLayout user={auth.user} hideNavigation={true}>
            <Head title="Draft New Shell" />

            {/* Builder Header (Matches the Edit.jsx Builder Nav) */}
            <nav className="bg-white border-b border-stone-200 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href={route('creator.certifications.index')} className="text-stone-400 hover:text-stone-900 font-bold transition-colors">
                        &larr; Cancel
                    </Link>
                    <span className="text-stone-300">|</span>
                    <span className="font-black text-stone-900 text-sm">Step 1: Shell Initialization</span>
                </div>
            </nav>

            <div className="py-12 bg-[#F9F8F6] min-h-screen selection:bg-orange-500 selection:text-white flex flex-col items-center">
                
                {/* Hero / Header */}
                <div className="text-center mb-10 max-w-2xl px-4">
                    <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">
                        💡
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight mb-3">
                        Draft a new Certification
                    </h1>
                    <p className="text-lg text-stone-500 font-medium">
                        Set up the basic details for your new Shell. You will add the curriculum, modules, and quizzes in the next step.
                    </p>
                </div>

                {/* Focused Form Card */}
                <div className="w-full max-w-2xl px-4">
                    <div className="bg-white rounded-[2rem] border border-stone-200 shadow-xl shadow-stone-200/50 overflow-hidden">
                        <form onSubmit={submit} className="p-8 sm:p-10 space-y-6">
                            
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Certification Title *</label>
                                <TextInput
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Masterclass: Advanced UI/UX Design"
                                    className="w-full bg-stone-50 focus:bg-white border-stone-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-lg font-bold text-stone-900"
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1.5">Category *</label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full bg-stone-50 focus:bg-white border-stone-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl font-medium text-stone-700"
                                        required
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category} className="mt-2" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1.5">Pricing (PHP) *</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-2.5 text-stone-400 font-bold">₱</span>
                                        <TextInput
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="1500"
                                            min="0"
                                            step="0.01"
                                            className="w-full pl-10 bg-stone-50 focus:bg-white border-stone-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl font-bold"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.price} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Short Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Briefly describe what students will learn in this certification..."
                                    rows="4"
                                    className="w-full bg-stone-50 focus:bg-white border-stone-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl resize-none font-medium text-stone-700"
                                ></textarea>
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="pt-6 border-t border-stone-100 mt-8">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full bg-stone-900 hover:bg-orange-500 text-white font-black text-lg py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {processing ? 'Initializing...' : 'Initialize Shell & Open Builder &rarr;'}
                                </button>
                                <p className="text-center text-xs font-bold text-stone-400 mt-4">
                                    You can change all of these details later in the Builder.
                                </p>
                            </div>

                        </form>
                    </div>
                </div>
                
            </div>
        </CreatorLayout>
    );
}