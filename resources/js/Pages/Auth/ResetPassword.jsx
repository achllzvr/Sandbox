import ForgotPassword from './ForgotPassword';

/** Laravel email reset links land here — reuse the Sandbox forgot-password flow. */
export default function ResetPassword({ token, email }) {
    return <ForgotPassword email={email} token={token} />;
}
