<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;max-width:480px;
             margin:0 auto;padding:32px 16px;color:#1c1c1c;">

  <h2 style="font-size:20px;font-weight:600;margin-bottom:4px;">
    Hi {{ $firstName }},
  </h2>

  <p style="color:#555;margin-bottom:24px;">
    Here is your Sandbox email verification code.
    It expires in <strong>10 minutes</strong>.
  </p>

  <div style="font-size:42px;font-weight:700;
              letter-spacing:14px;text-align:center;
              padding:24px;background:#FEF3C7;
              border-radius:12px;color:#92400E;
              margin-bottom:24px;">
    {{ $otp }}
  </div>

  <p style="color:#777;font-size:13px;">
    Do not share this code with anyone. Sandbox will never
    ask for your OTP via phone, chat, or email.
  </p>

  <p style="color:#777;font-size:13px;">
    If you did not create a Sandbox account,
    ignore this email.
  </p>

  <hr style="border:none;border-top:1px solid #eee;
             margin:24px 0;">

  <p style="color:#aaa;font-size:12px;text-align:center;">
    © 2026 Sandbox — Certification Platform
  </p>

</body>
</html>
