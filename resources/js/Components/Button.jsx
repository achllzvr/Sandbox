export const Button = ({
    variant = 'primary',
    size = 'lg',
    isLoading = false,
    disabled = false,
    isFilled = true,
    onClick,
    className = '',
    children,
    type = 'button',
    ...props
}) => {
    const variantClass =
        variant === 'secondary'
            ? 'btn-secondary'
            : variant === 'disabled'
              ? 'btn-disabled'
              : 'btn-primary';

    const classes = [
        'btn',
        variantClass,
        size === 'lg' ? 'btn-block' : '',
        variant === 'primary' && !isFilled ? 'btn-form-gated' : '',
        variant === 'primary' && isFilled ? 'is-filled' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const isDisabled =
        disabled || isLoading || (variant === 'primary' && !isFilled);

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={classes}
            {...props}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    );
};

export default Button;
