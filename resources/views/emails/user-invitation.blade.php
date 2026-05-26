<x-mail::message>
# You've been invited!

You have been invited to join the Sandbox LMS platform as a **{{ ucfirst($invitation->role) }}**.

To accept this invitation and set up your account, click the button below:

<x-mail::button :url="$inviteUrl">
Accept Invitation
</x-mail::button>

If you did not expect this invitation, you can safely ignore this email.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
