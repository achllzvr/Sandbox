<?php

namespace App\Mail;

use App\Models\UserInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UserInvitationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $invitation;
    public $inviteUrl;

    public function __construct(UserInvitation $invitation)
    {
        $this->invitation = $invitation;
        $this->inviteUrl = route('accept.invite', ['token' => $invitation->token]);
    }

    public function envelope()
    {
        return new Envelope(
            subject: 'You have been invited to Sandbox LMS!',
        );
    }

    public function content()
    {
        return new Content(
            markdown: 'emails.user-invitation',
        );
    }

    public function attachments()
    {
        return [];
    }
}
