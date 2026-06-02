import { Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function TeacherSearchCombobox({
    value,
    onChange,
    onSelect,
    options = [],
    placeholder = 'Search…',
    ariaLabel = 'Search',
    emptyLabel = 'No matches',
}) {
    const [open, setOpen] = useState(false);
    const [focused, setFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const wrapRef = useRef(null);

    const filteredOptions = useMemo(() => {
        const needle = value.trim().toLowerCase();
        if (!needle) {
            return options.slice(0, 8);
        }

        return options
            .filter(
                (option) =>
                    option.label.toLowerCase().includes(needle) ||
                    (option.sublabel ?? '').toLowerCase().includes(needle) ||
                    (option.value ?? '').toLowerCase().includes(needle),
            )
            .slice(0, 8);
    }, [options, value]);

    useEffect(() => {
        setActiveIndex(0);
    }, [value, filteredOptions.length]);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        function handlePointerDown(event) {
            if (wrapRef.current && !wrapRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handlePointerDown);

        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [open]);

    function chooseOption(option) {
        onChange(option.value ?? option.label);
        onSelect?.(option);
        setOpen(false);
    }

    function handleKeyDown(event) {
        if (!open && (event.key === 'ArrowDown' || event.key === 'Enter')) {
            setOpen(true);
            return;
        }

        if (!open) {
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex((current) => Math.min(current + 1, filteredOptions.length - 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((current) => Math.max(current - 1, 0));
        } else if (event.key === 'Enter' && filteredOptions[activeIndex]) {
            event.preventDefault();
            chooseOption(filteredOptions[activeIndex]);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    const showList = open && (filteredOptions.length > 0 || value.trim().length > 0);

    return (
        <div className={`teacher-search-combobox student-shop-search ${focused ? 'is-focused' : ''}`} ref={wrapRef}>
            <Search size={18} aria-hidden="true" className="student-shop-search__icon" />
            <input
                type="search"
                value={value}
                placeholder={placeholder}
                aria-label={ariaLabel}
                aria-autocomplete="list"
                aria-expanded={showList}
                aria-controls="teacher-search-combobox-list"
                onFocus={() => {
                    setFocused(true);
                    setOpen(true);
                }}
                onBlur={() => setFocused(false)}
                onChange={(event) => {
                    onChange(event.target.value);
                    setOpen(true);
                }}
                onKeyDown={handleKeyDown}
            />

            {showList ? (
                <ul id="teacher-search-combobox-list" className="teacher-search-combobox__list" role="listbox">
                    {filteredOptions.length === 0 ? (
                        <li className="teacher-search-combobox__option teacher-search-combobox__option--empty">{emptyLabel}</li>
                    ) : (
                        filteredOptions.map((option, index) => (
                            <li key={option.id ?? option.value ?? option.label}>
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={index === activeIndex}
                                    className={`teacher-search-combobox__option ${index === activeIndex ? 'teacher-search-combobox__option--active' : ''}`}
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => chooseOption(option)}
                                >
                                    <span className="teacher-search-combobox__option-label">{option.label}</span>
                                    {option.sublabel ? (
                                        <span className="teacher-search-combobox__option-sub">{option.sublabel}</span>
                                    ) : null}
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            ) : null}
        </div>
    );
}
