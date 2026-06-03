import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminModal from '@/Components/Admin/AdminModal';

// TODO: Load affiliation options from the backend instead of this hardcoded list.
const AFFILIATION_OPTIONS = [
    'National University',
    'De La Salle University',
    'University of the Philippines',
    'Ateneo de Manila University',
];

export default function CreateUserFlow({ show, onClose }) {
    const [step, setStep] = useState('role'); // role | form | success
    const [selectedRole, setSelectedRole] = useState('content_creator');
    const [confirmed, setConfirmed] = useState(false);

    const inviteForm = useForm({ email: '', role: 'content_creator', affiliation: '' });

    const reset = () => {
        setStep('role');
        setSelectedRole('content_creator');
        setConfirmed(false);
        inviteForm.reset();
        inviteForm.clearErrors();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleProceedToForm = () => {
        inviteForm.setData('role', selectedRole);
        setStep('form');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!confirmed) return;

        if (selectedRole === 'admin') {
            router.post(
                route('admin.users.invite-admin'),
                { email: inviteForm.data.email },
                {
                    onSuccess: () => setStep('success'),
                    onError: (errors) => inviteForm.setError(errors),
                }
            );
            return;
        }

        inviteForm.post(route('admin.users.invite'), {
            onSuccess: () => setStep('success'),
        });
    };

    const roleLabel = selectedRole === 'admin' ? 'Admin' : 'Creator';
    const highlightClass =
        selectedRole === 'admin' ? 'admin-highlight' : 'admin-highlight admin-highlight--creator';

    return (
        <>
            <AdminModal
                show={show && step === 'role'}
                onClose={handleClose}
                title="Create user"
                footer={
                    <button
                        type="button"
                        className="admin-btn admin-btn--primary admin-btn--block"
                        onClick={handleProceedToForm}
                    >
                        Proceed
                    </button>
                }
            >
                <p className="admin-form-label">Select role</p>
                <div className="admin-segment">
                    <button
                        type="button"
                        className={`admin-segment__btn ${selectedRole === 'admin' ? 'admin-segment__btn--active' : ''}`}
                        onClick={() => setSelectedRole('admin')}
                    >
                        Admin
                    </button>
                    <button
                        type="button"
                        className={`admin-segment__btn admin-segment__btn--creator ${selectedRole === 'content_creator' ? 'admin-segment__btn--active' : ''}`}
                        onClick={() => setSelectedRole('content_creator')}
                    >
                        Creator
                    </button>
                </div>
            </AdminModal>

            <AdminModal
                show={show && step === 'form'}
                onClose={handleClose}
                title={
                    <>
                        Create <span className={highlightClass}>{roleLabel}</span> user
                    </>
                }
                footer={
                    <>
                        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setStep('role')}>
                            Back
                        </button>
                        <button
                            type="submit"
                            form="create-user-form"
                            disabled={!confirmed || inviteForm.processing}
                            className={`admin-btn ${selectedRole === 'admin' ? 'admin-btn--primary' : 'admin-btn--creator'}`}
                        >
                            {inviteForm.processing ? 'Sending…' : 'Proceed'}
                        </button>
                    </>
                }
            >
                <form id="create-user-form" onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label htmlFor="create-email">Email</label>
                        <input
                            id="create-email"
                            type="email"
                            className="input-field"
                            value={inviteForm.data.email}
                            onChange={(e) => inviteForm.setData('email', e.target.value)}
                            required
                        />
                        {inviteForm.errors.email && (
                            <p className="admin-form-error">{inviteForm.errors.email}</p>
                        )}
                    </div>

                    {selectedRole === 'content_creator' && (
                        <div className="admin-form-group">
                            <label htmlFor="create-affiliation">Affiliation</label>
                            <select
                                id="create-affiliation"
                                className="input-field"
                                value={inviteForm.data.affiliation}
                                onChange={(e) => inviteForm.setData('affiliation', e.target.value)}
                            >
                                <option value="">Select affiliation (TODO: live list)</option>
                                {AFFILIATION_OPTIONS.map((a) => (
                                    <option key={a} value={a}>
                                        {a}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <label className="admin-checkbox-row">
                        <input
                            type="checkbox"
                            checked={confirmed}
                            onChange={(e) => setConfirmed(e.target.checked)}
                        />
                        <span>
                            I understand this action is <strong>irreversible</strong> and once the
                            code is sent, I cannot modify or send it to a different email.
                        </span>
                    </label>
                </form>
            </AdminModal>

            <AdminModal
                show={show && step === 'success'}
                onClose={handleClose}
                title={
                    <>
                        Created <span className={highlightClass}>{roleLabel}</span> user successfully
                    </>
                }
                footer={
                    <button type="button" className="admin-btn admin-btn--primary" onClick={handleClose}>
                        Finish
                    </button>
                }
            >
                <p className="admin-table__muted">
                    A link to complete the account setup has been sent to the respective email.
                </p>
            </AdminModal>
        </>
    );
}
