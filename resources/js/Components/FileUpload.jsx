import { forwardRef, useRef } from 'react';

export const FileUpload = forwardRef(
    (
        {
            label,
            error,
            onChange,
            accept = '.pdf,.jpg,.jpeg,.png',
            required = false,
            disabled = false,
            fileName,
            className = '',
            ...props
        },
        ref,
    ) => {
        const inputRef = useRef(null);
        const id = props.id || `file-${Math.random().toString(36).slice(2)}`;

        const openPicker = () => {
            if (!disabled) {
                (ref?.current || inputRef.current)?.click();
            }
        };

        return (
            <div className={`form-group ${className}`.trim()}>
                <div
                    className={`upload-field ${error ? 'upload-field--error' : ''}`}
                    onClick={openPicker}
                    onKeyDown={(e) => e.key === 'Enter' && openPicker()}
                    role="button"
                    tabIndex={0}
                >
                    <span className="upload-field__label">{label}</span>
                    <span className="upload-field__icon" aria-hidden="true">
                        ↑
                    </span>
                </div>
                {fileName && <p className="upload-field__filename">{fileName}</p>}
                <input
                    ref={ref || inputRef}
                    id={id}
                    type="file"
                    accept={accept}
                    required={required}
                    disabled={disabled}
                    className="upload-field__input"
                    onChange={onChange}
                    {...props}
                />
                {error && <span className="error-message">{error}</span>}
            </div>
        );
    },
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
