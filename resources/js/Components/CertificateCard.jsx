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

export default function CertificateCard({
    recipientName,
    certificationTitle,
    publisherName = 'Certificate Creator',
    issuedAt = null,
    code = null,
    showPublisherSignatures = true,
    className = '',
    id = 'student-certificate-print',
}) {
    const issuedDate = formatIssuedDate(issuedAt);

    return (
        <div className={`student-certificate__card ${className}`.trim()} id={id}>
            <div className="student-certificate__card-body">
                <p className="student-certificate__eyebrow">Certificate of Achievement</p>
                <p className="student-certificate__lead">is awarded to</p>
                <h1 className="student-certificate__name">{recipientName}</h1>
                <p className="student-certificate__lead">
                    for successfully completing the certification requirements for
                </p>
                <h2 className="student-certificate__program">{certificationTitle}</h2>
                <p className="student-certificate__publisher">on Sandbox</p>
            </div>

            {showPublisherSignatures ? (
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
                        {code ? <p className="student-certificate__code">Certificate ID: {code}</p> : null}
                    </div>
                </div>
            ) : code ? (
                <p className="student-certificate__code">Certificate ID · {code}</p>
            ) : null}

            <img className="student-certificate__mascot" src={assetUrl('images/Hermy.png')} alt="" />
        </div>
    );
}
