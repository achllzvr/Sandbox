import { Head } from '@inertiajs/react';
import CertificateCard from '@/Components/CertificateCard';

export default function PublicShow({ certificate }) {
    return (
        <div className="student-certificate student-certificate--public">
            <Head title={`Certificate · ${certificate.certification_title}`} />

            <CertificateCard
                recipientName={certificate.recipient_name}
                certificationTitle={certificate.certification_title}
                publisherName={certificate.publisher_name}
                issuedAt={certificate.issued_at}
                code={certificate.code}
                showPublisherSignatures
            />
        </div>
    );
}
