/**
 * Sandbox UI interactions — form-gated buttons & shared behaviors
 */
document.addEventListener('DOMContentLoaded', () => {
    initFormGatedButtons();
});

function initFormGatedButtons() {
    document.querySelectorAll('form').forEach((form) => {
        const gatedButtons = form.querySelectorAll('.btn-form-gated');
        if (!gatedButtons.length) {
            return;
        }

        const fields = form.querySelectorAll('.required-field, [required]');
        if (!fields.length) {
            return;
        }

        const checkFields = () => {
            const allFilled = [...fields].every((field) => {
                if (field.type === 'checkbox') {
                    return field.checked;
                }
                return String(field.value).trim() !== '';
            });

            gatedButtons.forEach((btn) => {
                btn.classList.toggle('is-filled', allFilled);
                btn.disabled = !allFilled;
            });
        };

        fields.forEach((field) => {
            field.addEventListener('input', checkFields);
            field.addEventListener('change', checkFields);
        });

        checkFields();
    });
}
