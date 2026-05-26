<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class TeacherRegistrationTest extends TestCase
{
    public function test_teacher_can_register()
    {
        $file = UploadedFile::fake()->create('credentials.pdf', 100);

        $response = $this->post('/register/teacher', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'teacher123@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'affiliation' => 'Some University',
            'institutional_credentials' => $file,
        ]);

        $response->dumpSession();
        $response->assertStatus(302);
        
        $this->assertDatabaseHas('users', [
            'email' => 'teacher123@example.com',
            'role' => 'teacher'
        ]);
    }
}
