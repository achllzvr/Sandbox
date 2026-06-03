<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TeacherRegistrationTest extends TestCase
{
    public function test_teacher_can_register_with_verification_documents(): void
    {
        if (! Schema::hasColumn('users', 'first_name') || ! Schema::hasColumn('users', 'id_front_url')) {
            $this->markTestSkipped('Sandbox users schema is required for teacher registration tests.');
        }

        Storage::fake('public');

        $email = 'teacher-reg-'.uniqid().'@example.com';

        $response = $this->post('/register/teacher', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => $email,
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'birthday' => '1990-01-15',
            'contact_no' => '09171234567',
            'affiliation' => 'Some University',
            'credential_proof' => UploadedFile::fake()->image('headshot.jpg'),
            'id_front' => UploadedFile::fake()->image('id-front.jpg'),
            'id_back' => UploadedFile::fake()->image('id-back.jpg'),
            'authorization_letter' => UploadedFile::fake()->create('authorization.pdf', 100, 'application/pdf'),
        ]);

        $response->assertRedirect(route('verification.notice'));

        $this->assertDatabaseHas('users', [
            'email' => $email,
            'role' => 'teacher',
            'status' => 'pending_verification',
            'affiliation' => 'Some University',
        ]);

        $user = User::where('email', $email)->first();

        $this->assertNotNull($user->institutional_credentials_url);
        $this->assertNotNull($user->id_front_url);
        $this->assertNotNull($user->id_back_url);
        $this->assertNotNull($user->authorization_letter_url);
    }
}
