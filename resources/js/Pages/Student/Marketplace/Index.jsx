import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';

const CARD_THEMES = ['green', 'blue', 'pink'];

function formatPrice(price) {
    const num = parseFloat(price);
    return num === 0 ? 'Free' : `₱${num.toLocaleString('en-PH', { minimumFractionDigits: 0 })}`;
}

export default function Index({ certifications }) {
    const { flash } = usePage().props;
    const [selectedCert, setSelectedCert] = useState(null);
    const [modalView, setModalView] = useState('details');
    const [search, setSearch] = useState('');
    const [technology, setTechnology] = useState('all');
    const [sort, setSort] = useState('price-asc');

    const enrollForm = useForm({
        certification_id: null,
        payment_method: 'xendit',
        tos_action_irreversible: false,
        tos_privacy_act: false,
    });

    const voucherForm = useForm({
        certification_id: null,
        code: '',
    });

    const catalog = useMemo(() => {
        let items = [...certifications.data];

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            items = items.filter(
                (cert) =>
                    cert.title.toLowerCase().includes(q) ||
                    cert.description?.toLowerCase().includes(q),
            );
        }

        if (technology !== 'all') {
            items = items.filter((cert) =>
                cert.title.toLowerCase().includes(technology.toLowerCase()),
            );
        }

        items.sort((a, b) => {
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);
            return sort === 'price-desc' ? priceB - priceA : priceA - priceB;
        });

        return items;
    }, [certifications.data, search, technology, sort]);

    function openShellDetail(cert) {
        setSelectedCert(cert);
        setModalView('details');
    }

    function closeModal() {
        setSelectedCert(null);
        setModalView('details');
        enrollForm.reset();
        voucherForm.reset();
        enrollForm.clearErrors();
        voucherForm.clearErrors();
    }

    function openEnrollmentToS() {
        setModalView('enroll_tos');
        enrollForm.setData({
            certification_id: selectedCert.id,
            payment_method: 'xendit',
            tos_action_irreversible: false,
            tos_privacy_act: false,
        });
    }

    function submitEnrollment(event) {
        event.preventDefault();
        enrollForm.post(route('student.enrollments.checkout'), {
            onSuccess: () => closeModal(),
        });
    }

    function openVoucherParams() {
        setModalView('voucher');
        voucherForm.setData({
            certification_id: selectedCert.id,
            code: '',
        });
    }

    function submitVoucher(event) {
        event.preventDefault();
        voucherForm.post(route('student.vouchers.redeem'), {
            onSuccess: () => closeModal(),
        });
    }

    return (
        <StudentLayout activeNav="shop" pageTitle="Shop">
            <Head title="Shop — Available Shells" />

            <h2 className="student-page-title">Available Shells</h2>
            <p className="student-page-subtitle">Browse the available certificates for taking!</p>

            <div className="student-shop-toolbar">
                <div className="student-shop-search">
                    <Search size={18} aria-hidden="true" />
                    <input
                        type="search"
                        placeholder="Search shells..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        aria-label="Search shells"
                    />
                </div>
                <select
                    className="student-shop-select"
                    value={technology}
                    onChange={(event) => setTechnology(event.target.value)}
                    aria-label="Filter by technology"
                >
                    <option value="all">Technology</option>
                    <option value="java">Java</option>
                    <option value="react">React</option>
                    <option value="laravel">Laravel</option>
                </select>
                <select
                    className="student-shop-select"
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    aria-label="Sort shells"
                >
                    <option value="price-asc">Low to high</option>
                    <option value="price-desc">High to low</option>
                </select>
            </div>

            {catalog.length === 0 ? (
                <div className="student-empty">
                    <p className="student-empty__title">No shells match your filters</p>
                    <p className="student-page-subtitle">Try clearing search or changing technology.</p>
                </div>
            ) : (
                <div className="student-shop-grid">
                    {catalog.map((cert, index) => {
                        const theme = CARD_THEMES[index % CARD_THEMES.length];
                        const creatorName = cert.creator
                            ? `${cert.creator.first_name} ${cert.creator.last_name}`
                            : 'Sandbox';

                        return (
                            <article key={cert.id} className={`student-shop-card student-shop-card--${theme}`}>
                                <div className="student-shop-card__hero">
                                    <span className="student-shop-card__price">{formatPrice(cert.price)}</span>
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: '2.5rem',
                                            fontWeight: 800,
                                            color: theme === 'blue' ? '#61dafb' : '#ef4444',
                                        }}
                                        aria-hidden="true"
                                    >
                                        {cert.title.charAt(0)}
                                    </span>
                                </div>
                                <div className="student-shop-card__body">
                                    <h3 className="student-shop-card__title">{cert.title.toUpperCase()}</h3>
                                    <p className="student-shop-card__creator">by {creatorName}</p>
                                    <p className="student-shop-card__desc">
                                        {cert.description || 'An exam covering foundational skills for this technology.'}
                                    </p>
                                    <button
                                        type="button"
                                        className="student-shop-card__btn"
                                        onClick={() => openShellDetail(cert)}
                                    >
                                        MORE DETAILS
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {certifications.last_page > 1 && (
                <nav className="student-shop-pagination" style={{ marginTop: 32, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {certifications.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className="student-nav__link"
                            style={{ padding: '8px 14px', fontSize: '0.75rem' }}
                            preserveScroll
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </nav>
            )}

            {selectedCert && (
                <div className="student-modal-overlay" role="dialog" aria-modal="true">
                    <div className="student-modal">
                        <div className="student-modal__header">
                            <button
                                type="button"
                                className="student-modal__header-btn"
                                onClick={() => (modalView !== 'details' ? setModalView('details') : closeModal())}
                            >
                                {modalView !== 'details' ? '← Back' : '✕ Close'}
                            </button>
                            <h3 className="student-modal__title">
                                {modalView === 'details'
                                    ? selectedCert.title
                                    : modalView === 'enroll_tos'
                                      ? 'You are enrolling'
                                      : 'Redeem voucher'}
                            </h3>
                            <span style={{ width: 48 }} />
                        </div>
                        <div className="student-modal__body">
                            {modalView === 'details' && (
                                <>
                                    <div
                                        className="student-modal__shell-icon"
                                        style={{ background: '#3b82f6' }}
                                    >
                                        {selectedCert.title.charAt(0)}
                                    </div>
                                    <h4 className="student-modal__cert-title">{selectedCert.title}</h4>
                                    <p className="student-modal__cert-sub">Professional Certificate</p>
                                    <div className="student-modal__desc">
                                        {selectedCert.description ||
                                            'An exam that covers the basics and foundational skills required. Ensure that you learn the fundamentals and modern technologies associated.'}
                                    </div>
                                    <div className="student-modal__meta-grid">
                                        <div className="student-modal__meta-item">
                                            <span className="student-modal__meta-label">Duration</span>
                                            <span className="student-modal__meta-value">Self-Paced</span>
                                        </div>
                                        <div className="student-modal__meta-item">
                                            <span className="student-modal__meta-label">Passing Goal</span>
                                            <span className="student-modal__meta-value" style={{ color: '#e8735a' }}>
                                                {selectedCert.pass_threshold}%
                                            </span>
                                        </div>
                                    </div>
                                    <button type="button" className="student-btn student-btn--primary" onClick={openEnrollmentToS}>
                                        ENROLL FOR {formatPrice(selectedCert.price)}
                                    </button>
                                    <button type="button" className="student-btn student-btn--secondary" onClick={openVoucherParams}>
                                        HAVE A VOUCHER?
                                    </button>
                                    <button
                                        type="button"
                                        className="student-btn student-btn--ghost"
                                        onClick={() => alert('TODO: Diagnostic pre-assessment flow')}
                                    >
                                        TRY A QUICK TEST
                                        <span className="student-todo-badge">TODO</span>
                                    </button>
                                </>
                            )}

                            {modalView === 'enroll_tos' && (
                                <form onSubmit={submitEnrollment}>
                                    <div className="student-modal__desc" style={{ textAlign: 'center', marginBottom: 16 }}>
                                        <strong>{selectedCert.title}</strong>
                                        <br />
                                        <span className="student-modal__cert-sub">Professional Certificate</span>
                                    </div>
                                    <label className="student-modal__checkbox">
                                        <input
                                            type="checkbox"
                                            checked={enrollForm.data.tos_action_irreversible}
                                            onChange={(event) =>
                                                enrollForm.setData('tos_action_irreversible', event.target.checked)
                                            }
                                        />
                                        <span>
                                            Do you understand that this action is <strong>irreversible</strong> and
                                            refunds are not allowed?
                                        </span>
                                    </label>
                                    <label className="student-modal__checkbox">
                                        <input
                                            type="checkbox"
                                            checked={enrollForm.data.tos_privacy_act}
                                            onChange={(event) =>
                                                enrollForm.setData('tos_privacy_act', event.target.checked)
                                            }
                                        />
                                        <span>
                                            Do you accept the Terms of Service and allow Sandbox to process your data
                                            under the Data Privacy Act of 2012?
                                        </span>
                                    </label>
                                    <button
                                        type="submit"
                                        className="student-btn student-btn--primary"
                                        disabled={
                                            !enrollForm.data.tos_action_irreversible ||
                                            !enrollForm.data.tos_privacy_act ||
                                            enrollForm.processing
                                        }
                                    >
                                        {enrollForm.processing
                                            ? 'Processing...'
                                            : `ENROLL FOR ${formatPrice(selectedCert.price)}`}
                                    </button>
                                    <button type="button" className="student-btn student-btn--secondary" onClick={openVoucherParams}>
                                        HAVE A VOUCHER?
                                    </button>
                                </form>
                            )}

                            {modalView === 'voucher' && (
                                <form onSubmit={submitVoucher}>
                                    {voucherForm.errors.code && (
                                        <div className="student-modal__error">{voucherForm.errors.code}</div>
                                    )}
                                    {flash?.error && <div className="student-modal__error">{flash.error}</div>}
                                    <input
                                        type="text"
                                        className="student-modal__voucher-input"
                                        placeholder="Voucher Code"
                                        value={voucherForm.data.code}
                                        onChange={(event) =>
                                            voucherForm.setData('code', event.target.value.toUpperCase())
                                        }
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="student-btn student-btn--coral"
                                        style={{ marginTop: 16 }}
                                        disabled={!voucherForm.data.code || voucherForm.processing}
                                    >
                                        {voucherForm.processing ? 'Verifying...' : 'CONFIRM VOUCHER CODE'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </StudentLayout>
    );
}
