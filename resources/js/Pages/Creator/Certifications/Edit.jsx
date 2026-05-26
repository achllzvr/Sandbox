import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import CreatorLayout from '@/Layouts/CreatorLayout';
import TextInput from '@/Components/TextInput';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Creator/CertificationController.php @ edit / update
 * Required Props:
 * 1. certification: { id, title, description, price, status }
 * 2. modules: Array of { id, title, order, contents: [{ id, type, title }] }
 * * * Endpoints to wire to buttons:
 * - Update Details: route('creator.certifications.update', id)
 * - Add Module: route('creator.modules.store', cert_id)
 * - Add Content to Module: route('creator.contents.store', module_id)
 * ==============================================================================
 */

export default function CreatorShellBuilder({ auth, certification, modules = [] }) {
    const { data, setData, put, processing } = useForm({
        title: certification?.title || '',
        description: certification?.description || '',
        price: certification?.price || '',
        status: certification?.status || 'Draft',
    });

    const [expandedModuleId, setExpandedModuleId] = useState(null);

    const updateShellDetails = (e) => {
        e.preventDefault();
        put(route('creator.certifications.update', certification.id));
    };

    const toggleModule = (id) => {
        setExpandedModuleId(expandedModuleId === id ? null : id);
    };

    return (
        <CreatorLayout user={auth.user} hideNavigation={true}>
            <Head title={`Builder: ${certification?.title || 'New Shell'}`} />

            {/* Builder Header */}
            <nav className="bg-white border-b border-stone-200 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href={route('creator.certifications.index')} className="text-stone-400 hover:text-stone-900 font-bold transition-colors">
                        &larr; Exit Builder
                    </Link>
                    <span className="text-stone-300">|</span>
                    <span className="font-black text-stone-900 bg-stone-100 px-3 py-1 rounded-md text-sm">{data.status}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={updateShellDetails} 
                        disabled={processing}
                        className="text-stone-500 hover:text-stone-900 font-bold px-4 py-2 transition-colors disabled:opacity-50"
                    >
                        {processing ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button className="bg-stone-900 hover:bg-orange-500 text-white font-bold px-6 py-2 rounded-lg transition-colors shadow-sm">
                        Publish Shell
                    </button>
                </div>
            </nav>

            <div className="py-8 bg-[#F9F8F6] min-h-screen selection:bg-orange-500 selection:text-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex flex-col lg:flex-row gap-8">
                        
                        {/* LEFT COLUMN: Curriculum Builder */}
                        <div className="w-full lg:w-2/3 space-y-6">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h2 className="text-2xl font-black text-stone-900 tracking-tight">Curriculum Planner</h2>
                                    <p className="text-sm font-medium text-stone-500">Organize your modules, quizzes, and the Final Sandcastle Exam.</p>
                                </div>
                            </div>

                            {/* The Modules Accordion */}
                            <div className="space-y-4">
                                {modules.length > 0 ? modules.map((mod, index) => {
                                    const isExpanded = expandedModuleId === mod.id;
                                    
                                    return (
                                        <div key={mod.id} className={`bg-white rounded-2xl border transition-all duration-300 ${isExpanded ? 'border-orange-300 shadow-md ring-1 ring-orange-500' : 'border-stone-200 shadow-sm'}`}>
                                            
                                            {/* Accordion Header */}
                                            <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => toggleModule(mod.id)}>
                                                <div className="cursor-grab text-stone-300 hover:text-stone-500 px-2 py-1">⋮⋮</div>
                                                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm shrink-0">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-grow">
                                                    <h4 className="font-bold text-stone-900">{mod.title}</h4>
                                                </div>
                                                <div className={`text-stone-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</div>
                                            </div>

                                            {/* Expanded Content Area */}
                                            {isExpanded && (
                                                <div className="bg-stone-50 border-t border-stone-200 p-5 rounded-b-2xl">
                                                    <div className="space-y-3 mb-4">
                                                        {mod.contents?.map(content => (
                                                            <div key={content.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-stone-200 shadow-sm group">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="cursor-grab text-stone-300 hover:text-stone-500">⋮⋮</div>
                                                                    <span className="text-lg w-6 text-center">{content.type === 'video' ? '▶️' : content.type === 'quiz' ? '📝' : '📊'}</span>
                                                                    <span className="font-bold text-stone-700 text-sm">{content.title}</span>
                                                                </div>
                                                                <button className="text-stone-400 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold">Edit</button>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Add Content Buttons */}
                                                    <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-200 mt-4">
                                                        <button className="text-xs font-bold bg-white border border-stone-200 text-stone-600 hover:border-orange-500 hover:text-orange-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                                            <span>+ Video</span>
                                                        </button>
                                                        <button className="text-xs font-bold bg-white border border-stone-200 text-stone-600 hover:border-orange-500 hover:text-orange-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                                            <span>+ PPT / PDF</span>
                                                        </button>
                                                        <button className="text-xs font-bold bg-white border border-stone-200 text-stone-600 hover:border-orange-500 hover:text-orange-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                                            <span>+ Quiz</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }) : (
                                    <div className="p-10 border-2 border-dashed border-stone-300 rounded-2xl text-center">
                                        <p className="text-stone-500 font-medium">No modules yet. Start building your curriculum.</p>
                                    </div>
                                )}
                            </div>

                            {/* Add Module Button */}
                            <button className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 font-black py-4 rounded-2xl border-2 border-orange-200 border-dashed transition-colors flex items-center justify-center gap-2">
                                <span className="text-xl">+</span> Add New Module
                            </button>

                        </div>

                        {/* RIGHT COLUMN: Meta Data Configuration */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm p-6 sm:p-8 sticky top-24">
                                <h3 className="text-xl font-black text-stone-900 mb-6">Shell Configuration</h3>
                                
                                <form onSubmit={updateShellDetails} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-1.5">Certification Title</label>
                                        <TextInput
                                            type="text"
                                            name="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full bg-stone-50 focus:bg-white border-stone-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-1.5">Pricing (PHP)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-2.5 text-stone-400 font-bold">₱</span>
                                            <TextInput
                                                type="number"
                                                name="price"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                className="w-full pl-10 bg-stone-50 focus:bg-white border-stone-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-1.5">Description Summary</label>
                                        <textarea
                                            name="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows="4"
                                            className="w-full bg-stone-50 focus:bg-white border-stone-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl resize-none text-sm"
                                        ></textarea>
                                    </div>

                                    <div className="pt-4 border-t border-stone-100">
                                        <label className="block text-sm font-bold text-stone-700 mb-1.5">Thumbnail Image</label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-stone-300 border-dashed rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-colors cursor-pointer group">
                                            <div className="space-y-1 text-center">
                                                <div className="text-3xl text-stone-400 group-hover:text-orange-500 mb-2">🖼️</div>
                                                <div className="text-sm text-stone-600">
                                                    <span className="font-bold text-orange-500">Upload a file</span> or drag and drop
                                                </div>
                                                <p className="text-xs text-stone-500">PNG, JPG up to 2MB</p>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </CreatorLayout>
    );
}