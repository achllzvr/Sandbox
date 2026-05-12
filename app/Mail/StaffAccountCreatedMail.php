<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StaffAccountCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $content_creator;
    public $plainPassword;

    public function __construct(User $content_creator, $plainPassword)
    {
        $this->content_creator = $content_creator;
        $this->plainPassword = $plainPassword;
    }

    public function build()
    {
        return $this->subject('Your Content Creator Account Has Been Created')
                    ->view('emails.content_creator-account-created');
    }
}