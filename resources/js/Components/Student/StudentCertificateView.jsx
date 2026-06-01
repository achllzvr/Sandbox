import { Head } from '@inertiajs/react';
import { Copy, Download, Share2 } from 'lucide-react';
import { useState } from 'react';
import { assetUrl } from '@/utils/assetUrl';

function formatIssuedDate(issuedAt) {
    if (!issuedAt) {
        return null;
    }

    const date = new Date(issuedAt);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function StudentCertificateView({
    certification,
    user,
    certificate,
    themeVars = {},
    onClose,
}) {
    const [copyLabel, setCopyLabel] = useState('Copy link');

    const recipientName = `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() || 'Sandbox Learner';
    const publisherName = certification?.creator?.full_name?.trim() || 'Certificate Creator';
    const publicUrl =
        certificate?.public_url ??
        (certificate?.code ? route('certificates.public', certificate.code) : '');
    const issuedDate = formatIssuedDate(certificate?.issued_at);

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

                <div
                    className="student-certificate__card student-enter__item"
                    id="student-certificate-print"
                    style={{ '--student-enter-index': 1 }}
                >
                    <div className="student-certificate__card-body">
                        <p className="student-certificate__eyebrow">Certificate of Achievement</p>
                        <p className="student-certificate__lead">is awarded to</p>
                        <h1 className="student-certificate__name">{recipientName}</h1>
                        <p className="student-certificate__lead">
                            for successfully completing the certification requirements for
                        </p>
                        <h2 className="student-certificate__program">{certification.title}</h2>
                        <p className="student-certificate__publisher">on Sandbox</p>
                    </div>

                    <div className="student-certificate__footer">
                        <div className="student-certificate__signatures">
                            <div className="student-certificate__signature">
                                <p className="student-certificate__signature-name">Achilles Vonn Rabina</p>
                                <p className="student-certificate__signature-role">Sandbox Co-Founder</p>
                            </div>
                            <div className="student-certificate__signature">
                                <p className="student-certificate__signature-name">Joseph Michael Aramil</p>
                                <p className="student-certificate__signature-role">Sandbox Co-Founder</p>
                            </div>
                            <div className="student-certificate__signature">
                                <p className="student-certificate__signature-name">{publisherName}</p>
                                <p className="student-certificate__signature-role">Certificate Publisher</p>
                            </div>
                        </div>

                        <div className="student-certificate__meta">
                            {issuedDate ? (
                                <p className="student-certificate__date">Given this day of {issuedDate}</p>
                            ) : null}
                            {certificate?.code ? (
                                <p className="student-certificate__code">Certificate ID: {certificate.code}</p>
                            ) : null}
                        </div>
                    </div>

                    <img
                        className="student-certificate__mascot"
                        src={assetUrl('images/Hermy.png')}
                        alt=""
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
