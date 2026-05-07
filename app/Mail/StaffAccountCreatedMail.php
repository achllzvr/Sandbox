<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StaffAccountCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $staff;
    public $plainPassword;

    public function __construct(User $staff, $plainPassword)
    {
        $this->staff = $staff;
        $this->plainPassword = $plainPassword;
    }

    public function build()
    {
        return $this->subject('Your Staff Account Has Been Created')
                    ->view('emails.staff-account-created');
    }
}