import { Copy, Download, Share2 } from 'lucide-react';
import { useState } from 'react';
import { assetUrl } from '@/utils/assetUrl';

export default function StudentCertificateView({
    certification,
    user,
    certificate,
    onClose,
}) {
    const [copyLabel, setCopyLabel] = useState('Copy public link');

    const publicUrl = certificate?.public_url ?? '';
    const recipientName = `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim();

    async function handleCopyLink() {
        if (!publicUrl) {
            return;
        }

        try {
            await navigator.clipboard.writeText(publicUrl);
            setCopyLabel('Link copied!');
            window.setTimeout(() => setCopyLabel('Copy public link'), 2000);
        } catch {
            setCopyLabel('Copy failed');
        }
    }

    function handleDownloadPdf() {
        window.print();
    }

    async function handleShare() {
        if (!publicUrl) {
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
        <div className="student-certificate">
            <Head title="Certificate of Achievement" />

            <button
                type="button"
                className="student-certificate__close"
                onClick={onClose}
                aria-label="Close certificate"
            >
                ✕
            </button>

            <div className="student-certificate__card" id="student-certificate-print">
                <p className="student-certificate__eyebrow">Certificate of Achievement</p>
                <p className="student-certificate__lead">is awarded to</p>
                <h1 className="student-certificate__name">{recipientName}</h1>
                <p className="student-certificate__lead">
                    for successfully completing the certification requirements for
                </p>
                <h2 className="student-certificate__program">{certification.title}</h2>
                {certificate?.code ? (
                    <p className="student-certificate__code">Certificate ID · {certificate.code}</p>
                ) : null}
                <img
                    className="student-certificate__mascot"
                    src={assetUrl('images/Hermy.png')}
                    alt=""
                />
            </div>

            {certificate?.public_url ? (
                <div className="student-certificate__actions">
                    <button type="button" className="student-certificate__action-btn" onClick={handleCopyLink}>
                        <Copy size={16} strokeWidth={2.25} aria-hidden="true" />
                        {copyLabel}
                    </button>
                    <button type="button" className="student-certificate__action-btn" onClick={handleDownloadPdf}>
                        <Download size={16} strokeWidth={2.25} aria-hidden="true" />
                        Download PDF
                    </button>
                    <button type="button" className="student-certificate__action-btn" onClick={handleShare}>
                        <Share2 size={16} strokeWidth={2.25} aria-hidden="true" />
                        Share
                    </button>
                </div>
            ) : null}
        </div>
    );
}
