import { useEffect, useState } from 'react';

const DEFAULT_REQUIREMENTS = [
    { key: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { key: 'upper', label: 'Must have at least one Capital letter', test: (p) => /[A-Z]/.test(p) },
    { key: 'symbol', label: 'Must have at least one Symbol', test: (p) => /[^A-Za-z0-9]/.test(p) },
    { key: 'number', label: 'Must have at least one Number', test: (p) => /[0-9]/.test(p) },
];

export const PasswordRequirements = ({
    password = '',
    requirements = DEFAULT_REQUIREMENTS,
    onAllMetChange,
}) => {
    const [met, setMet] = useState([]);

    useEffect(() => {
        const results = requirements.map((req) => req.test(password));
        setMet(results);
        onAllMetChange?.(results.every(Boolean));
    }, [password, requirements, onAllMetChange]);

    return (
        <div className="password-requirements">
            <p className="password-requirements-title">Password Requirements:</p>
            <ul>
                {requirements.map((req, index) => (
                    <li key={req.key || index} className={met[index] ? 'met' : ''}>
                        {req.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PasswordRequirements;
