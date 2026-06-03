import { Head } from '@inertiajs/react';
import { Copy, Download, Share2 } from 'lucide-react';
import { useState } from 'react';
import CertificateCard from '@/Components/CertificateCard';

export default function StudentCertificateView({
    certification,
    user,
    certificate,
    themeVars = {},
    onClose,
}) {
    const [copyLabel, setCopyLabel] = useState('Copy link');

    const recipientName = `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() || 'Sandbox Learner';
    const publisherName = certification?.creator?.full_name?.trim() || certificate?.publisher_name || 'Certificate Creator';
    const publicUrl =
        certificate?.public_url ??
        (certificate?.code ? route('certificates.public', certificate.code) : '');

    async function handleCopyLink() {
        if (!publicUrl) {
            setCopyLabel('Link unavailable');
            window.setTimeout(() => setCopyLabel('Copy link'), 2000);
            return;
        }

        try {
            await navigator.clipboard.writeText(publicUrl);
            setCopyLabel('Link copied!');
            window.setTimeout(() => setCopyLabel('Copy link'), 2000);
        } catch {
            setCopyLabel('Copy failed');
            window.setTimeout(() => setCopyLabel('Copy link'), 2000);
        }
    }

    function handleDownloadPdf() {
        document.body.classList.add('student-certificate-printing');

        const cleanup = () => {
            document.body.classList.remove('student-certificate-printing');
            window.removeEventListener('afterprint', cleanup);
        };

        window.addEventListener('afterprint', cleanup);
        window.print();
    }

    async function handleShare() {
        if (!publicUrl) {
            handleCopyLink();
            return;
        }

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${certification.title} — Hermit Certificate`,
                    text: `${recipientName} earned a Sandbox certification!`,
                    url: publicUrl,
                });
                return;
            } catch {
                // fall through to copy
            }
        }

        handleCopyLink();
    }

    return (
        <div className="student-certificate" style={themeVars}>
            <Head title="Certificate of Achievement" />

            <div className="student-certificate__stage student-enter-stagger">
                <button
                    type="button"
                    className="student-certificate__close student-enter__item"
                    style={{ '--student-enter-index': 0 }}
                    onClick={onClose}
                    aria-label="Close certificate"
                >
                    ✕
                </button>

                <div className="student-enter__item" style={{ '--student-enter-index': 1 }}>
                    <CertificateCard
                        recipientName={recipientName}
                        certificationTitle={certification.title}
                        publisherName={publisherName}
                        issuedAt={certificate?.issued_at}
                        code={certificate?.code}
                        showPublisherSignatures
                    />
                </div>

                <div
                    className="student-certificate__actions student-enter__item"
                    style={{ '--student-enter-index': 2 }}
                >
                    <button type="button" className="student-certificate__action-btn" onClick={handleCopyLink}>
                        <Copy size={16} strokeWidth={2.25} aria-hidden="true" />
                        {copyLabel}
                    </button>
                    <button type="button" className="student-certificate__action-btn" onClick={handleDownloadPdf}>
                        <Download size={16} strokeWidth={2.25} aria-hidden="true" />
                        Download
                    </button>
                    <button type="button" className="student-certificate__action-btn" onClick={handleShare}>
                        <Share2 size={16} strokeWidth={2.25} aria-hidden="true" />
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
}
