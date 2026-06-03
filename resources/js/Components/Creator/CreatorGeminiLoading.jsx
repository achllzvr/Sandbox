import { Loader2, Sparkles } from 'lucide-react';

export default function CreatorGeminiLoading({ steps, activeStep, progress }) {
    return (
        <div className="creator-gemini-loading admin-fade-in-up">
            <div className="creator-gemini-loading__hero">
                <span className="creator-gemini-loading__icon-wrap" aria-hidden="true">
                    <Sparkles size={22} strokeWidth={2.25} />
                    <Loader2 size={18} strokeWidth={2.25} className="creator-gemini-loading__spinner" />
                </span>
                <div>
                    <h3 className="creator-gemini-loading__title">Generating questions</h3>
                    <p className="admin-text-muted">Gemini is reading your materials and drafting the quiz. Large files may take a minute.</p>
                </div>
            </div>

            <div className="creator-gemini-loading__progress">
                <div className="creator-progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                    <div className="creator-progress-bar__fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="creator-gemini-loading__percent">{progress}%</span>
            </div>

            <ol className="creator-gemini-loading__steps">
                {steps.map((label, index) => {
                    const isDone = index < activeStep;
                    const isActive = index === activeStep;

                    return (
                        <li
                            key={label}
                            className={`creator-gemini-loading__step${isDone ? ' creator-gemini-loading__step--done' : ''}${isActive ? ' creator-gemini-loading__step--active' : ''}`}
                        >
                            <span className="creator-gemini-loading__step-marker" aria-hidden="true">
                                {isDone ? '✓' : index + 1}
                            </span>
                            <span>{label}</span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
