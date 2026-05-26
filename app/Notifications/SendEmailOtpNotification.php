<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendEmailOtpNotification extends Notification
{
    use Queueable;

    private string $otp;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(string $otp)
    {
        $this->otp = $otp;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Your Sandbox Verification Code')
                    ->greeting('Hello!')
                    ->line('Your Sandbox email verification code is: ')
                    ->line($this->otp)
                    ->line('This code will expire in 10 minutes.')
                    ->line('If you did not request this, please ignore this email.');
    }
}

