import { Head } from '@inertiajs/react';
import { assetUrl } from '@/utils/assetUrl';

export default function PublicShow({ certificate }) {
    return (
        <div className="student-certificate student-certificate--public">
            <Head title={`Certificate · ${certificate.certification_title}`} />

            <div className="student-certificate__card">
                <p className="student-certificate__eyebrow">Certificate of Achievement</p>
                <p className="student-certificate__lead">is awarded to</p>
                <h1 className="student-certificate__name">{certificate.recipient_name}</h1>
                <p className="student-certificate__lead">
                    for successfully completing the certification requirements for
                </p>
                <h2 className="student-certificate__program">{certificate.certification_title}</h2>
                <p className="student-certificate__code">Certificate ID · {certificate.code}</p>
                <img
                    className="student-certificate__mascot"
                    src={assetUrl('images/Hermy.png')}
                    alt=""
                />
            </div>
        </div>
    );
}
