import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, Loader2, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import StudentShopCard from '@/Components/Student/StudentShopCard';
import StudentShopModal from '@/Components/Student/StudentShopModal';
import StudentShopShellPage from '@/Components/Student/StudentShopShellPage';
import StudentLayout from '@/Layouts/StudentLayout';
import { groupShopCatalog } from '@/utils/shopCatalog';

const FALLBACK_CATEGORIES = ['Java', 'Laravel', 'React'];

export default function Index({ certifications, filters = {}, categories = [], enrolledCertificationIds = [] }) {
    const { flash, errors: pageErrors = {} } = usePage().props;
    const [selectedCert, setSelectedCert] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [pageMode, setPageMode] = useState('browse');
    const [modalView, setModalView] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [sort, setSort] = useState(filters.sort || 'price-asc');
    const [isFiltering, setIsFiltering] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [categoryFocused, setCategoryFocused] = useState(false);
    const [sortFocused, setSortFocused] = useState(false);

    const catalog = certifications.data;
    const isSearchPending = search !== (filters.search || '');
    const showSearchLoader = isSearchPending || isFiltering;

    const categoryOptions = useMemo(() => {
        const merged = [...new Set([...(categories ?? []), ...FALLBACK_CATEGORIES])];
        return merged.sort((a, b) => a.localeCompare(b));
    }, [categories]);

    const catalogSections = useMemo(
        () => groupShopCatalog(catalog, enrolledCertificationIds, filters.category || 'all'),
        [catalog, enrolledCertificationIds, filters.category],
    );

    const applyFilters = useCallback((nextSearch, nextCategory, nextSort) => {
        router.get(
            route('marketplace.index'),
            {
                search: nextSearch || undefined,
                category: nextCategory && nextCategory !== 'all' ? nextCategory : undefined,
                sort: nextSort && nextSort !== 'price-asc' ? nextSort : undefined,
            },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
                onStart: () => setIsFiltering(true),
                onFinish: () => setIsFiltering(false),
            },
        );
    }, []);

    useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);

    useEffect(() => {
        setCategory(filters.category || 'all');
    }, [filters.category]);

    useEffect(() => {
        setSort(filters.sort || 'price-asc');
    }, [filters.sort]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                applyFilters(search, category, sort);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [search, filters.search, category, sort, applyFilters]);

    useEffect(() => {
        const checkoutUrl = flash?.xendit_checkout_url;
        if (checkoutUrl) {
            window.location.assign(checkoutUrl);
        }
    }, [flash?.xendit_checkout_url]);

    useEffect(() => {
        if (!pageErrors.checkout) {
            return;
        }

        setModalView('enroll_tos');
    }, [pageErrors.checkout]);

    useEffect(() => {
        if (!flash?.shop_success) {
            return;
        }

        const enrolled = certifications.data.find((cert) => cert.id === flash.shop_success);
        if (enrolled) {
            setSelectedCert(enrolled);
            setSelectedIndex(certifications.data.findIndex((cert) => cert.id === enrolled.id));
            setPageMode('browse');
            setModalView('success');
        }
    }, [flash?.shop_success, certifications.data]);

    function openShellDetail(cert) {
        if (enrolledCertificationIds.includes(cert.id)) {
            return;
        }

        const index = catalog.findIndex((item) => item.id === cert.id);
        setSelectedCert(cert);
        setSelectedIndex(index >= 0 ? index : 0);
        setPageMode('detail');
        setModalView(null);
    }

    function closeDetail() {
        setPageMode('browse');
        setSelectedCert(null);
        setModalView(null);
    }

    function openEnrollmentToS() {
        setModalView('enroll_tos');
    }

    function openVoucherFlow() {
        setModalView('voucher_claim');
    }

    function closeModal() {
        setModalView(null);
    }

    function handleModalBack() {
        setModalView(null);
    }

    function handleCategoryChange(event) {
        const value = event.target.value;
        setCategory(value);
        applyFilters(search, value, sort);
    }

    function handleSortChange(event) {
        const value = event.target.value;
        setSort(value);
        applyFilters(search, category, value);
    }

    function clearFilters() {
        setSearch('');
        setCategory('all');
        setSort('price-asc');
        applyFilters('', 'all', 'price-asc');
    }

    const hasActiveFilters =
        Boolean(filters.search) ||
        (filters.category && filters.category !== 'all') ||
        filters.sort === 'price-desc';

    return (
        <StudentLayout
            activeNav="shop"
            layoutMode="select"
            workspaceModifier={pageMode === 'detail' ? 'shop-detail' : undefined}
        >
            <Head title="Shop — Available Shells" />

            {pageMode === 'detail' && selectedCert ? (
                <StudentShopShellPage
                    cert={selectedCert}
                    catalogIndex={selectedIndex}
                    onBack={closeDetail}
                    onOpenEnroll={openEnrollmentToS}
                    onOpenVoucher={openVoucherFlow}
                />
            ) : (
                <div className="student-shop-page student-enter-stagger">
                    <header className="student-home-header student-shop-page__header student-enter__item" style={{ '--student-enter-index': 0 }}>
                        <h2 className="student-page-title">Available Shells</h2>
                        <p className="student-page-subtitle">Browse the available certificates for taking!</p>
                    </header>

                    <div
                        className={`student-shop-toolbar student-enter__item ${isFiltering ? 'student-shop-toolbar--loading' : ''}`}
                        style={{ '--student-enter-index': 1 }}
                    >
                        <div
                            className={`student-shop-search ${searchFocused ? 'is-focused' : ''} ${showSearchLoader ? 'is-loading' : ''}`}
                        >
                            {showSearchLoader ? (
                                <Loader2 size={18} aria-hidden="true" className="student-shop-search__loader" />
                            ) : (
                                <Search size={18} aria-hidden="true" className="student-shop-search__icon" />
                            )}
                            <input
                                type="search"
                                placeholder="Search shells..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                aria-label="Search shells"
                                aria-busy={showSearchLoader}
                            />
                        </div>
                        <div className={`student-shop-select-wrap ${categoryFocused ? 'is-focused' : ''}`}>
                            <ChevronDown size={16} aria-hidden="true" className="student-shop-select-wrap__icon" />
                            <select
                                className="student-shop-select"
                                value={category}
                                onChange={handleCategoryChange}
                                onFocus={() => setCategoryFocused(true)}
                                onBlur={() => setCategoryFocused(false)}
                                aria-label="Filter by technology"
                            >
                                <option value="all">Technology</option>
                                <option value="purchased">Already Purchased</option>
                                {categoryOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={`student-shop-select-wrap ${sortFocused ? 'is-focused' : ''}`}>
                            <ChevronDown size={16} aria-hidden="true" className="student-shop-select-wrap__icon" />
                            <select
                                className="student-shop-select"
                                value={sort}
                                onChange={handleSortChange}
                                onFocus={() => setSortFocused(true)}
                                onBlur={() => setSortFocused(false)}
                                aria-label="Sort shells"
                            >
                                <option value="price-asc">Low to high</option>
                                <option value="price-desc">High to low</option>
                            </select>
                        </div>
                    </div>

                    {catalog.length === 0 ? (
                        <div className="student-empty student-enter__item" style={{ '--student-enter-index': 2 }}>
                            <p className="student-empty__title">No shells match your filters</p>
                            <p className="student-page-subtitle">Try clearing search or changing technology.</p>
                            {hasActiveFilters ? (
                                <button type="button" className="student-btn student-empty__cta" onClick={clearFilters}>
                                    Clear filters
                                </button>
                            ) : null}
                        </div>
                    ) : (
                        <div
                            className={`student-shop-sections student-enter__item ${isFiltering ? 'student-shop-sections--loading' : ''}`}
                            style={{ '--student-enter-index': 2 }}
                        >
                            {catalogSections.map((section, sectionIndex) => (
                                <section key={section.id} className="student-shop-section">
                                    <div className="student-shell-group__divider">
                                        <span>{section.title}</span>
                                    </div>
                                    <div className="student-shop-grid student-shells-grid">
                                        {section.items.map((cert, index) => (
                                            <StudentShopCard
                                                key={cert.id}
                                                cert={cert}
                                                index={sectionIndex * 10 + index}
                                                isOwned={enrolledCertificationIds.includes(cert.id)}
                                                onOpenDetails={openShellDetail}
                                            />
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}

                    {certifications.last_page > 1 ? (
                        <nav className="student-shop-pagination student-enter__item" style={{ '--student-enter-index': 3 }} aria-label="Shell pages">
                            {certifications.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`student-shop-pagination__link ${link.active ? 'is-active' : ''} ${!link.url ? 'is-disabled' : ''}`}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    ) : null}
                </div>
            )}

            {selectedCert && modalView ? (
                <StudentShopModal
                    cert={selectedCert}
                    view={modalView}
                    catalogIndex={selectedIndex}
                    flashError={flash?.error}
                    checkoutError={pageErrors.checkout}
                    onClose={closeModal}
                    onBack={handleModalBack}
                    onOpenEnroll={openEnrollmentToS}
                    onOpenVoucher={openVoucherFlow}
                />
            ) : null}
        </StudentLayout>
    );
}
