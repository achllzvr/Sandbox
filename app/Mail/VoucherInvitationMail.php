<?php

namespace App\Mail;

use App\Models\Certification;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VoucherInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $shellTitle;

    public string $teacherName;

    public function __construct(
        public Voucher $voucher,
        public string $recipientEmail,
    ) {
        $cert = Certification::find($voucher->certification_id);
        $this->shellTitle = $cert ? strtoupper($cert->title) : 'SHELL';

        $teacher = User::find($voucher->teacher_id);
        $this->teacherName = $teacher ? trim($teacher->first_name.' '.$teacher->last_name) : 'Your teacher';
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your group voucher for '.$this->shellTitle,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.voucher-invitation',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
