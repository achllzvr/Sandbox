import { assetUrl } from '@/utils/assetUrl';

export default function HermySpeechBubble({
    label = null,
    children,
    className = '',
    avatarPosition = 'left',
    compact = false,
}) {
    const hermyRight = avatarPosition === 'right';
    const hermyBottom = avatarPosition === 'bottom';

    return (
        <div
            className={[
                'student-quiz__chat',
                hermyRight ? 'student-quiz__chat--hermy-right' : '',
                hermyBottom ? 'student-quiz__chat--hermy-bottom' : '',
                compact ? 'student-quiz__chat--compact' : '',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {hermyBottom ? (
                <>
                    <div
                        className={[
                            'student-quiz__bubble-shell',
                            'student-quiz__bubble-shell--tail-bottom',
                        ].join(' ')}
                    >
                        <div className="student-quiz__bubble">
                            {label ? <p className="student-quiz__bubble-label">{label}</p> : null}
                            <div className="student-quiz__bubble-text">{children}</div>
                        </div>
                    </div>
                    <div className="student-quiz__avatar-wrap">
                        <img className="student-quiz__avatar" src={assetUrl('images/Hermy.png')} alt="" />
                    </div>
                </>
            ) : hermyRight ? (
                <>
                    <div
                        className={[
                            'student-quiz__bubble-shell',
                            'student-quiz__bubble-shell--tail-right',
                        ].join(' ')}
                    >
                        <div className="student-quiz__bubble">
                            {label ? <p className="student-quiz__bubble-label">{label}</p> : null}
                            <div className="student-quiz__bubble-text">{children}</div>
                        </div>
                    </div>
                    <div className="student-quiz__avatar-wrap">
                        <img className="student-quiz__avatar" src={assetUrl('images/Hermy.png')} alt="" />
                    </div>
                </>
            ) : (
                <>
                    <div className="student-quiz__avatar-wrap">
                        <img className="student-quiz__avatar" src={assetUrl('images/Hermy.png')} alt="" />
                    </div>
                    <div className="student-quiz__bubble-shell">
                        <div className="student-quiz__bubble">
                            {label ? <p className="student-quiz__bubble-label">{label}</p> : null}
                            <div className="student-quiz__bubble-text">{children}</div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
