import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/*
 * ==============================================================================
 * BACKEND INTEGRATION NOTES FOR MIKE & AHMAD:
 * ==============================================================================
 * Controller: app/Http/Controllers/Student/QuizController.php
 * Required Props:
 * 1. question: { id, text, type }
 * 2. options: Array of { id, text }
 * 3. progress: { current_number, total_questions }
 * 4. feedback: null (initial) OR { is_correct: boolean, correct_option_id: int, message: string }
 * ==============================================================================
 */

export default function QuizShow({ auth, question, options = [], progress, feedback }) {
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Checks if the user has submitted and we received feedback from backend
    const hasAnswered = feedback !== null && feedback !== undefined;

    const handleSubmit = () => {
        if (!selectedOptionId) return;
        setIsSubmitting(true);
        // Submits answer to Mike & Ahmad's endpoint
        router.post(route('student.quizzes.submit', question.id), {
            answer_id: selectedOptionId
        }, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleNext = () => {
        // Loads the next question
        router.get(route('student.quizzes.next', question.id));
    };

    return (
        <AuthenticatedLayout user={auth.user} hideNavigation={true}>
            <Head title="Sandbox Assessment" />

            <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center pt-12 pb-24 px-6 selection:bg-orange-500 selection:text-white">
                
                {/* Progress Header */}
                <div className="w-full max-w-3xl mb-8 flex justify-between items-center">
                    <button className="text-stone-400 hover:text-stone-900 font-bold text-sm">
                        &larr; Exit Test
                    </button>
                    <div className="text-sm font-black text-stone-500 tracking-widest uppercase bg-stone-100 px-4 py-1.5 rounded-full">
                        Question {progress?.current_number} of {progress?.total_questions}
                    </div>
                </div>

                {/* Main Question Card */}
                <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg shadow-stone-200/50 p-8 md:p-12 border border-stone-100">
                    
                    <h2 className="text-2xl md:text-3xl font-black text-stone-900 leading-tight mb-8">
                        {question?.text || "What is the primary function of a React component?"}
                    </h2>

                    {/* Multiple Choice Grid */}
                    <div className="space-y-4 mb-10">
                        {options.map((option) => {
                            // Determine dynamic styling based on user interaction and backend feedback
                            let baseStyle = "w-full text-left p-5 rounded-2xl border-2 font-bold text-lg transition-all flex items-center justify-between ";
                            
                            if (!hasAnswered) {
                                // Default selection state before submitting
                                baseStyle += selectedOptionId === option.id 
                                    ? "border-orange-500 bg-orange-50 text-orange-900" 
                                    : "border-stone-200 text-stone-600 hover:border-orange-300 hover:bg-stone-50";
                            } else {
                                // After submitting: Show Correct (Green) and Wrong (Red)
                                if (option.id === feedback.correct_option_id) {
                                    baseStyle += "border-green-500 bg-green-50 text-green-900";
                                } else if (selectedOptionId === option.id && !feedback.is_correct) {
                                    baseStyle += "border-red-500 bg-red-50 text-red-900 line-through opacity-75";
                                } else {
                                    baseStyle += "border-stone-100 text-stone-400 opacity-50";
                                }
                            }

                            return (
                                <button 
                                    key={option.id}
                                    disabled={hasAnswered}
                                    onClick={() => setSelectedOptionId(option.id)}
                                    className={baseStyle}
                                >
                                    <span>{option.text}</span>
                                    
                                    {/* Radio indicator */}
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                        selectedOptionId === option.id && !hasAnswered ? 'border-orange-500' : 
                                        hasAnswered && option.id === feedback.correct_option_id ? 'border-green-500 bg-green-500 text-white' :
                                        hasAnswered && selectedOptionId === option.id && !feedback.is_correct ? 'border-red-500 bg-red-500 text-white' :
                                        'border-stone-300'
                                    }`}>
                                        {hasAnswered && option.id === feedback.correct_option_id && <span className="text-sm leading-none">✓</span>}
                                        {hasAnswered && selectedOptionId === option.id && !feedback.is_correct && <span className="text-sm leading-none">✕</span>}
                                        {selectedOptionId === option.id && !hasAnswered && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Action Area & Mascot Feedback */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-stone-100">
                        
                        {/* Hermy Mascot Feedback Area */}
                        <div className="flex items-center gap-4 flex-1">
                            {hasAnswered && (
                                <>
                                    {/* TODO: Search for Hermy Mascot assets here later. Swap image based on feedback.is_correct */}
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0 ${
                                        feedback.is_correct ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
                                    }`}>
                                        {feedback.is_correct ? '🦀' : '😿'}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-black text-lg ${feedback.is_correct ? 'text-green-700' : 'text-red-700'}`}>
                                            {feedback.is_correct ? 'Spot on!' : 'Not quite!'}
                                        </h4>
                                        <p className="text-sm font-medium text-stone-500">
                                            {feedback.message || (feedback.is_correct ? '+10 Sand Dollars' : 'Review the module and try again.')}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Submit / Next Button */}
                        <div className="w-full sm:w-auto">
                            {!hasAnswered ? (
                                <button 
                                    onClick={handleSubmit}
                                    disabled={!selectedOptionId || isSubmitting}
                                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-black px-10 py-4 rounded-xl shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 active:scale-95"
                                >
                                    {isSubmitting ? 'Checking...' : 'Check Answer'}
                                </button>
                            ) : (
                                <button 
                                    onClick={handleNext}
                                    className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white font-black px-10 py-4 rounded-xl shadow-lg transition-all active:scale-95"
                                >
                                    Next Question &rarr;
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}