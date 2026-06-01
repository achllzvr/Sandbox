<div style="font-family: sans-serif; color: #333; max-width: 560px;">
    <h2>You're approved, {{ $user->first_name }}!</h2>
    <p>
        Your affiliated Hermit account for <strong>{{ $user->affiliation }}</strong> has been
        verified by the Sandbox Administration Team.
    </p>
    <p>You can now sign in and access the affiliate portal to purchase vouchers and manage learners.</p>
    <p>
        <a href="{{ url('/login') }}" style="color: #b45309; font-weight: bold;">Sign in to Sandbox</a>
    </p>
    <br>
    <p>Best regards,<br>The Sandbox Team</p>
</div>
