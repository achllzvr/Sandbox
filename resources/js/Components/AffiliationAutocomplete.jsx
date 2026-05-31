import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from '@/Utils/formUtils';

export default function AffiliationAutocomplete({
    value = '',
    onChange,
    placeholder = 'Organization / Institution',
    error,
    required = false,
    name = 'affiliation',
    initialOptions = [],
}) {
    const [query, setQuery] = useState(value);
    const [options, setOptions] = useState(initialOptions);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapRef = useRef(null);

    useEffect(() => {
        setQuery(value ?? '');
    }, [value]);

    const fetchOptions = useCallback(
        debounce(async (search) => {
            setLoading(true);
            try {
                const url = route('affiliations.index', search ? { q: search } : {});
                const res = await fetch(url, {
                    headers: { Accept: 'application/json' },
                });
                if (!res.ok) return;
                const json = await res.json();
                setOptions(json.data ?? []);
            } catch {
                /* keep previous options */
            } finally {
                setLoading(false);
            }
        }, 220),
        [],
    );

    useEffect(() => {
        fetchOptions(query);
    }, [query, fetchOptions]);

    useEffect(() => {
        if (!open) return undefined;

        const onPointerDown = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', onPointerDown);
        return () => document.removeEventListener('mousedown', onPointerDown);
    }, [open]);

    const selectOption = (option) => {
        setQuery(option);
        onChange(option);
        setOpen(false);
    };

    const showList = open && (options.length > 0 || loading);

    return (
        <div className="form-group affiliation-autocomplete" ref={wrapRef}>
            <div className="affiliation-autocomplete__field">
                <input
                    type="text"
                    id={name}
                    name={name}
                    className={`input-field required-field ${error ? 'input-field--error' : ''}`}
                    value={query}
                    placeholder={placeholder}
                    required={required}
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-expanded={showList}
                    aria-controls={`${name}-listbox`}
                    onChange={(e) => {
                        const next = e.target.value;
                        setQuery(next);
                        onChange(next);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                />
                {showList && (
                    <ul
                        id={`${name}-listbox`}
                        className="affiliation-autocomplete__list"
                        role="listbox"
                    >
                        {loading && options.length === 0 && (
                            <li className="affiliation-autocomplete__empty">Searching…</li>
                        )}
                        {!loading &&
                            options.map((option) => (
                                <li key={option} role="option">
                                    <button
                                        type="button"
                                        className="affiliation-autocomplete__option"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => selectOption(option)}
                                    >
                                        {option}
                                    </button>
                                </li>
                            ))}
                        {!loading && options.length === 0 && query.trim() && (
                            <li className="affiliation-autocomplete__empty">
                                No matches — you can enter a new affiliation
                            </li>
                        )}
                    </ul>
                )}
            </div>
            {error && <span className="error-message">{error}</span>}
        </div>
    );
}
