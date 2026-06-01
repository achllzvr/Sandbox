import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import Modal from '@/Components/Modal';
import { assetUrl } from '@/utils/assetUrl';
import { resolveShellMapTheme } from '@/utils/shellThemes';

const INTRO_POINTS = [
    {
        id: 'independent',
        label: 'I will complete this exam independently — no notes, browsers, or outside help.',
    },
    {
        id: 'honest',
        label: 'I will answer honestly. My score reflects what I have learned in the sandboxes.',
    },
    {
        id: 'resume',
        label: 'I understand I may leave and return later, and my progress will be saved where I left off.',
    },
    {
        id: 'attempts',
        label: 'I understand each submission counts as an attempt and is recorded for my certification record.',
    },
];

const EXIT_POINTS = [
    {
        id: 'saved',
        label: 'I understand my answers so far will be saved automatically.',
    },
    {
        id: 'continue',
        label: 'I understand I can continue this attempt from the shell map whenever I am ready.',
    },
    {
        id: 'not-submitted',
        label: 'I understand the exam is not submitted until I finish the last question.',
    },
];

export default function StudentExamDisclaimerModal({
    show,
    variant = 'intro',
    attemptCount = 0,
    shellMeta = {},
    onConfirm,
    onCancel,
}) {
    const isIntro = variant === 'intro';
    const points = useMemo(() => (isIntro ? INTRO_POINTS : EXIT_POINTS), [isIntro]);
    const [checked, setChecked] = useState(() => points.map(() => false));

    const { className: themeKey, style: themeVars } = resolveShellMapTheme(shellMeta);
    const allAcknowledged = checked.every(Boolean);

    useEffect(() => {
        if (show) {
            setChecked(points.map(() => false));
        }
    }, [show, points]);

    const togglePoint = (index) => {
        setChecked((current) => current.map((value, i) => (i === index ? !value : value)));
    };

    return (
        <Modal show={show} onClose={onCancel} maxWidth="md" panelClassName="student-exam-modal-panel">
            <div className={`student-exam-modal student-exam-modal--${themeKey}`} style={themeVars}>
                <button type="button" className="student-exam-modal__close" onClick={onCancel} aria-label="Close">
                    <X size={18} strokeWidth={2.5} />
                </button>

                <div className="student-exam-modal__icon" aria-hidden="true">
                    <img src={assetUrl('images/Hermy.png')} alt="" />
                </div>

                <h2 className="student-exam-modal__title">
                    {isIntro ? 'Before you begin' : 'Leave the final exam?'}
                </h2>

                <p className="student-exam-modal__lead">
                    {isIntro
                        ? 'This is your official Hermit certification exam. Please read and acknowledge each guideline.'
                        : 'You have not finished the exam yet. Please confirm before exiting.'}
                </p>

                <ul className="student-exam-modal__checks">
                    {points.map((point, index) => (
                        <li key={point.id}>
                            <label className="student-exam-modal__check">
                                <input
                                    type="checkbox"
                                    className="student-exam-modal__checkbox"
                                    checked={checked[index]}
                                    onChange={() => togglePoint(index)}
                                />
                                <span className="student-exam-modal__check-box" aria-hidden="true" />
                                <span className="student-exam-modal__check-label">{point.label}</span>
                            </label>
                        </li>
                    ))}
                </ul>

                {isIntro && attemptCount > 0 && (
                    <p className="student-exam-modal__meta">
                        Previous attempts recorded: <strong>{attemptCount}</strong>
                    </p>
                )}

                <div className="student-exam-modal__actions">
                    <button type="button" className="student-exam-modal__btn student-exam-modal__btn--ghost" onClick={onCancel}>
                        {isIntro ? 'Not yet' : 'Keep going'}
                    </button>
                    <button
                        type="button"
                        className="student-exam-modal__btn student-exam-modal__btn--primary"
                        disabled={!allAcknowledged}
                        onClick={onConfirm}
                    >
                        {isIntro ? 'I understand — begin' : 'Save & exit'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
