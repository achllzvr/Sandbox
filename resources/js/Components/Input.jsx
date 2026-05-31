import { forwardRef } from 'react';

export const Input = forwardRef(
    (
        {
            type = 'text',
            label,
            placeholder,
            error,
            disabled = false,
            onChange,
            value,
            className = '',
            required = false,
            inlineAction,
            onInlineAction,
            hideLabel = false,
            ...props
        },
        ref,
    ) => {
        const inputId = props.id || props.name || `input-${Math.random().toString(36).slice(2)}`;

        const inputEl = (
            <input
                ref={ref}
                id={inputId}
                type={type}
                value={value ?? ''}
                onChange={onChange}
                placeholder={placeholder || label}
                disabled={disabled}
                required={required}
                className={`input-field required-field ${error ? 'input-field--error' : ''} ${className}`.trim()}
                aria-invalid={error ? 'true' : undefined}
                {...props}
            />
        );

        return (
            <div className="form-group">
                {label && !hideLabel && (
                    <label htmlFor={inputId}>
                        {label}
                        {required && <span className="text-danger"> *</span>}
                    </label>
                )}

                {inlineAction ? (
                    <div className="input-wrapper">
                        {inputEl}
                        {typeof inlineAction === 'string' ? (
                            <button
                                type="button"
                                className="input-inline-action"
                                onClick={onInlineAction}
                            >
                                {inlineAction}
                            </button>
                        ) : (
                            inlineAction
                        )}
                    </div>
                ) : (
                    inputEl
                )}

                {error && <span className="error-message">{error}</span>}
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;
