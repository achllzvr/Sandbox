import { Head, usePage, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { useRef, useState, useEffect } from 'react';

export default function VerifyOtp({ email }) {
    // Mask email: "juan@gmail.com" → "j***@gmail.com"
    function maskEmail(emailStr) {
        if (!emailStr) return '';
        const [local, domain] = emailStr.split('@');
        if (!local || !domain) return emailStr;
        return local.charAt(0) + '***@' + domain;
    }

    // 6-box OTP state
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputs = useRef([]);

    // Countdown for resend button
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // Submitting state
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (countdown <= 0) {
            setCanResend(true);
            return;
        }
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    // Auto-submit when all 6 digits filled
    useEffect(() => {
        if (otp.every(d => d !== '') && !submitting) {
            handleSubmit();
        }
    }, [otp]);

    function handleChange(index, value) {
        // Accept digits only
        const digit = value.replace(/\D/g, '').slice(-1);
        const next = [...otp];
        next[index] = digit;
        setOtp(next);
        
        // Auto-advance focus
        if (digit && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(index, e) {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    }

    function handleSubmit() {
        setSubmitting(true);
        router.post(route('otp.verify.submit'),
            { otp: otp.join('') },
            { 
                onError: () => {
                    setSubmitting(false);
                    setOtp(['', '', '', '', '', '']);
                    inputs.current[0]?.focus();
                }
            }
        );
    }

    function handleResend() {
        router.post(route('verification.send'), {}, {
            onSuccess: () => {
                setCountdown(60);
                setCanResend(false);
                setOtp(['', '', '', '', '', '']);
                inputs.current[0]?.focus();
            }
        });
    }

    const { errors, flash } = usePage().props;

    return (
        <GuestLayout>
            <Head title="Check your email" />

            <div className="max-w-md mx-auto mt-8 md:mt-16 bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-6 text-3xl">
                        ✉️
                    </div>
                    <h1 className="text-2xl font-bold text-stone-900">Check your email</h1>
                    <p className="text-stone-500 text-sm mt-2">
                        We sent a 6-digit code to <span className="font-semibold text-stone-900">{maskEmail(email)}</span>
                    </p>
                </div>

                {flash?.success && (
                    <div className="mb-6 font-medium text-sm text-green-600 bg-green-50 border border-green-200 p-4 rounded-xl text-center">
                        {flash.success}
                    </div>
                )}

                <div className="flex gap-3 justify-center mt-8">
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            ref={el => inputs.current[i] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleChange(i, e.target.value)}
                            onKeyDown={e => handleKeyDown(i, e)}
                            className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none transition-colors ${
                                errors?.otp 
                                    ? 'border-red-300 focus:border-red-500 bg-red-50 text-red-900' 
                                    : 'border-stone-300 focus:border-amber-500 bg-white text-stone-900'
                            }`}
                        />
                    ))}
                </div>

                {errors?.otp && (
                    <p className="text-red-600 text-sm text-center mt-4 font-medium">
                        {errors.otp}
                    </p>
                )}

                <div className="mt-8">
                    <button 
                        onClick={handleSubmit}
                        disabled={otp.some(d => d === '') || submitting}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {submitting ? 'Verifying...' : 'Verify Email'}
                    </button>
                </div>

                <div className="text-center mt-6 border-t border-stone-200 pt-6">
                    {canResend ? (
                        <button 
                            onClick={handleResend}
                            className="text-amber-600 hover:text-amber-800 text-sm font-medium transition-colors"
                        >
                            Resend code
                        </button>
                    ) : (
                        <p className="text-stone-400 text-sm">
                            Resend in <span className="font-semibold text-stone-500">{countdown}s</span>
                        </p>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}
