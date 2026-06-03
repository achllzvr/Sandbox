<x-mail::message>
# Group voucher for {{ $shellTitle }}

{{ $teacherName }} shared a group voucher so you can enroll in **{{ $shellTitle }}** on {{ config('app.name') }}.

**Voucher code:** `{{ $voucher->code }}`

Sign in with this email address ({{ $recipientEmail }}), open the shop, and redeem the code to join your class cast.

<x-mail::button :url="route('marketplace.index')">
Open the shop
</x-mail::button>

If you did not expect this voucher, you can ignore this email.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
