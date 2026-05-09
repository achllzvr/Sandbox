import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function VerifyOtp({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        otp: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('otp.verify'));
    };

    const resend = (e) => {
        e.preventDefault();
        post(route('otp.resend'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-4 text-sm text-gray-600">
                Thanks for signing up! Before getting started, could you verify your email address by entering the 6-digit OTP we just emailed to you? 
                If you didn\'t receive the email, we will gladly send you another.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    A new verification code has been sent to the email address you provided during registration.
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <TextInput
                        id="otp"
                        type="text"
                        name="otp"
                        value={data.otp}
                        className="mt-1 block w-full text-center tracking-widest text-2xl"
                        onChange={(e) => setData('otp', e.target.value)}
                        maxLength={6}
                        placeholder="000000"
                        required
                        autoFocus
                    />
                    <InputError message={errors.otp} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={resend}
                        disabled={processing}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Resend Code
                    </button>

                    <PrimaryButton className="ml-4" disabled={processing || data.otp.length !== 6}>
                        Verify OTP
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

