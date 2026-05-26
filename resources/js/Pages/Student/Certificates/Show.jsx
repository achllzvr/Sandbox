import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Student/ProfileController.php or new CertificateController
 * Required Props:
 * 1. certificate: { id, student_name, course_title, date_issued, pdf_download_url }
 * ==============================================================================
 */

export default function CertificateShow({ auth, certificate }) {
    
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Your Certificate" />

            <div className="py-12 bg-[#F9F8F6] min-h-screen selection:bg-orange-500 selection:text-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    
                    {/* Page Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-500 rounded-full text-3xl mb-4 shadow-sm">
                            🏆
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight mb-3">
                            Congratulations, {auth.user.first_name}!
                        </h1>
                        <p className="text-lg text-stone-500 max-w-xl mx-auto font-medium">
                            You've successfully completed the Sandcastle Exam and earned your certification. 
                        </p>
                    </div>

                    {/* Certificate Display Frame */}
                    <div className="w-full bg-white p-4 md:p-8 rounded-[2rem] shadow-xl shadow-stone-200/50 border border-stone-200 mb-10">
                        {/* Actual Certificate Area - Replace bg-stone-100 with actual rendered HTML or generated Image later */}
                        <div className="w-full aspect-[1.414/1] bg-[#FDFCFB] border-[8px] border-stone-100 rounded-xl relative flex flex-col items-center justify-center p-8 md:p-16 text-center shadow-inner">
                            
                            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                                {/* Watermark */}
                                <span className="font-black text-9xl">SANDBOX</span>
                            </div>

                            <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-3xl mb-8 shadow-md">
                                S
                            </div>
                            
                            <h4 className="text-stone-400 font-black tracking-[0.2em] uppercase text-sm mb-4">
                                Certificate of Completion
                            </h4>
                            
                            <h2 className="text-4xl md:text-6xl font-black text-stone-900 mb-8 italic" style={{ fontFamily: 'Georgia, serif' }}>
                                {certificate?.student_name || `${auth.user.first_name} ${auth.user.last_name}`}
                            </h2>
                            
                            <p className="text-stone-500 font-medium text-lg max-w-lg mb-2">
                                has successfully completed the certification requirements for
                            </p>
                            
                            <h3 className="text-2xl md:text-3xl font-black text-orange-500 mb-12">
                                {certificate?.course_title || 'Introduction to React.js'}
                            </h3>

                            <div className="flex justify-between w-full border-t border-stone-200 pt-6 mt-auto">
                                <div className="text-left">
                                    <p className="text-stone-800 font-bold text-lg">{certificate?.date_issued || 'May 26, 2026'}</p>
                                    <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Date Issued</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-stone-800 font-bold text-lg">{certificate?.id || 'CRT-8X9P-22M1'}</p>
                                    <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Credential ID</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a 
                            href={certificate?.pdf_download_url || '#'}
                            target="_blank"
                            className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-4 rounded-xl shadow-md shadow-orange-500/20 transition-all hover:-translate-y-0.5 text-center"
                        >
                            Download PDF
                        </a>
                        <button className="bg-stone-900 hover:bg-stone-800 text-white font-black px-8 py-4 rounded-xl shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                            <span>Add to LinkedIn</span>
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </button>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}