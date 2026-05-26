import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CreatorLayout from '@/Layouts/CreatorLayout';
import TextInput from '@/Components/TextInput';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Creator/ModuleContentController.php @ edit / update
 * Required Props:
 * 1. content: { id, module_id, type: 'video' | 'presentation' | 'quiz', title, url, ... }
 * 2. questions: (If type === 'quiz') Array of { id, text, options: [{ id, text, is_correct }] }
 * ==============================================================================
 */

export default function CreatorSandboxEditor({ auth, content, questions: initialQuestions = [] }) {
    // We assume the type is passed from the backend, but fallback to 'video' for scaffolding
    const contentType = content?.type || 'video';

    const { data, setData, put, processing } = useForm({
        title: content?.title || '',
        url: content?.url || '',
        file: null, // For PPT/PDF uploads
        // Quiz payload structure
        questions: initialQuestions.length > 0 ? initialQuestions : [
            { text: '', options: [{ text: '', is_correct: true }, { text: '', is_correct: false }] }
        ]
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('creator.contents.update', content?.id || 1));
    };

    // Quiz Builder Logic
    const addQuestion = () => {
        setData('questions', [...data.questions, { text: '', options: [{ text: '', is_correct: true }, { text: '', is_correct: false }] }]);
    };

    const updateQuestion = (qIndex, field, value) => {
        const updated = [...data.questions];
        updated[qIndex][field] = value;
        setData('questions', updated);
    };

    const addOption = (qIndex) => {
        const updated = [...data.questions];
        updated[qIndex].options.push({ text: '', is_correct: false });
        setData('questions', updated);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const updated = [...data.questions];
        updated[qIndex].options[oIndex].text = value;
        setData('questions', updated);
    };

    const setCorrectOption = (qIndex, oIndex) => {
        const updated = [...data.questions];
        updated[qIndex].options.forEach((opt, idx) => {
            opt.is_correct = (idx === oIndex);
        });
        setData('questions', updated);
    };

    return (
        <CreatorLayout user={auth.user} hideNavigation={true}>
            <Head title={`Editor: ${data.title || 'Sandbox Item'}`} />

            {/* Editor Navbar */}
            <nav className="bg-white border-b border-stone-200 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href={route('creator.certifications.index')} className="text-stone-400 hover:text-stone-900 font-bold transition-colors">
                        &larr; Back to Curriculum
                    </Link>
                    <span className="text-stone-300">|</span>
                    <span className="font-black text-stone-900 text-sm">
                        {contentType === 'video' ? '▶️ Video Editor' : contentType === 'quiz' ? '📝 Assessment Builder' : '📊 Presentation'}
                    </span>
                </div>
                <button 
                    onClick={submit} 
                    disabled={processing}
                    className="bg-stone-900 hover:bg-orange-500 text-white font-bold px-6 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                    {processing ? 'Saving...' : 'Save Changes'}
                </button>
            </nav>

            <div className="py-8 bg-[#F9F8F6] min-h-screen selection:bg-orange-500 selection:text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm p-6 sm:p-10">
                        <h2 className="text-2xl font-black text-stone-900 mb-6">Item Configuration</h2>
                        
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-stone-700 mb-1.5">Content Title</label>
                            <TextInput
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. Introduction to React Hooks"
                                className="w-full bg-stone-50 focus:bg-white border-stone-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                            />
                        </div>

                        {/* CONDITIONAL UI: MEDIA (Video / PPT) */}
                        {contentType !== 'quiz' && (
                            <div className="space-y-6">
                                <div className="p-6 border-2 border-dashed border-stone-300 rounded-2xl bg-stone-50/50 hover:bg-orange-50 hover:border-orange-500 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center h-48">
                                    <div className="text-4xl mb-3 text-stone-400 group-hover:text-orange-500 transition-colors">
                                        {contentType === 'video' ? '▶️' : '📄'}
                                    </div>
                                    <p className="font-bold text-stone-700 group-hover:text-orange-600">
                                        Click to upload or drag {contentType === 'video' ? 'MP4' : 'PDF/PPTX'} here
                                    </p>
                                    <p className="text-xs text-stone-400 mt-1">Maximum file size 50MB</p>
                                </div>
                                
                                {contentType === 'video' && (
                                    <div className="relative flex items-center py-4">
                                        <div className="flex-grow border-t border-stone-200"></div>
                                        <span className="shrink-0 mx-4 text-xs font-bold text-stone-400 uppercase tracking-widest">OR EMBED LINK</span>
                                        <div className="flex-grow border-t border-stone-200"></div>
                                    </div>
                                )}

                                {contentType === 'video' && (
                                    <div>
                                        <label className="block text-sm font-bold text-stone-700 mb-1.5">YouTube / Vimeo URL</label>
                                        <TextInput
                                            type="url"
                                            value={data.url}
                                            onChange={(e) => setData('url', e.target.value)}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="w-full bg-stone-50 focus:bg-white border-stone-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* CONDITIONAL UI: QUIZ BUILDER */}
                        {contentType === 'quiz' && (
                            <div className="space-y-10 border-t border-stone-200 pt-8 mt-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-stone-900">Questions</h3>
                                    <span className="text-sm font-bold text-stone-400 bg-stone-100 px-3 py-1 rounded-lg">{data.questions.length} Items</span>
                                </div>

                                {data.questions.map((q, qIndex) => (
                                    <div key={qIndex} className="bg-stone-50 p-6 rounded-2xl border border-stone-200 relative group">
                                        <div className="absolute -left-3 -top-3 w-8 h-8 bg-orange-100 text-orange-600 font-black rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                                            {qIndex + 1}
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Question Text</label>
                                            <TextInput
                                                type="text"
                                                value={q.text}
                                                onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                                                className="w-full bg-white border-stone-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Answers</label>
                                            {q.options.map((opt, oIndex) => (
                                                <div key={oIndex} className={`flex items-center gap-3 p-2 rounded-xl border ${opt.is_correct ? 'bg-green-50 border-green-200' : 'bg-white border-stone-200'}`}>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setCorrectOption(qIndex, oIndex)}
                                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${opt.is_correct ? 'border-green-500 bg-green-500 text-white' : 'border-stone-300 hover:border-orange-300'}`}
                                                    >
                                                        {opt.is_correct && <span className="text-xs">✓</span>}
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={opt.text}
                                                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                        placeholder={`Option ${oIndex + 1}`}
                                                        className="flex-grow bg-transparent border-none focus:ring-0 text-sm font-medium p-0"
                                                    />
                                                </div>
                                            ))}
                                            <button 
                                                type="button" 
                                                onClick={() => addOption(qIndex)}
                                                className="text-xs font-bold text-orange-500 hover:text-orange-600 mt-2 flex items-center gap-1"
                                            >
                                                + Add Option
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button 
                                    type="button"
                                    onClick={addQuestion}
                                    className="w-full bg-white border-2 border-dashed border-stone-300 hover:border-orange-500 text-stone-500 hover:text-orange-600 font-black py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <span>+ Add New Question</span>
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </CreatorLayout>
    );
}