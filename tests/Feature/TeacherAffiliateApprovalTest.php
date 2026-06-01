<?php

namespace Tests\Feature;

use App\Mail\TeacherAffiliateApprovedMail;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class TeacherAffiliateApprovalTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);
    }

    public function test_admin_can_approve_pending_affiliate(): void
    {
        Mail::fake();

        $admin = User::where('role', 'admin')->first();
        if (! $admin) {
            $admin = User::create([
                'first_name' => 'Test',
                'last_name' => 'Admin',
                'email' => 'test-admin-approval@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => now(),
            ]);
        }

        $teacher = User::create([
            'first_name' => 'Affiliate',
            'last_name' => 'Pending',
            'email' => 'affiliate-pending-'.uniqid().'@example.com',
            'password' => Hash::make('password'),
            'affiliation' => 'Test University',
            'role' => 'teacher',
            'status' => 'pending_verification',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($admin)->put(route('admin.users.verify-teacher', $teacher), [
            'action' => 'approve',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $teacher->refresh();

        $this->assertSame('active', $teacher->status);
        $this->assertTrue($teacher->is_active);
        $this->assertNotNull($teacher->verified_at);
        $this->assertSame($admin->id, $teacher->verified_by);

        Mail::assertSent(TeacherAffiliateApprovedMail::class, function ($mail) use ($teacher) {
            return $mail->hasTo($teacher->email);
        });

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $admin->id,
            'action' => 'teacher_approved',
        ]);
    }

    public function test_admin_can_decline_pending_affiliate(): void
    {
        Mail::fake();

        $admin = User::where('role', 'admin')->first();
        $this->assertNotNull($admin);

        $teacher = User::create([
            'first_name' => 'Affiliate',
            'last_name' => 'Decline',
            'email' => 'affiliate-decline-'.uniqid().'@example.com',
            'password' => Hash::make('password'),
            'affiliation' => 'Test University',
            'role' => 'teacher',
            'status' => 'pending_verification',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($admin)->put(route('admin.users.verify-teacher', $teacher), [
            'action' => 'decline',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $teacher->refresh();

        $this->assertSame('declined', $teacher->status);
        $this->assertFalse((bool) $teacher->is_active);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $admin->id,
            'action' => 'teacher_declined',
        ]);
    }

    public function test_approved_affiliate_can_log_in(): void
    {
        $teacher = User::create([
            'first_name' => 'Affiliate',
            'last_name' => 'Active',
            'email' => 'affiliate-active-'.uniqid().'@example.com',
            'password' => Hash::make('password123'),
            'affiliation' => 'Test University',
            'role' => 'teacher',
            'status' => 'active',
            'is_active' => true,
            'email_verified_at' => now(),
            'verified_at' => now(),
        ]);

        $response = $this->post(route('login'), [
            'email' => $teacher->email,
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('teacher.dashboard'));
        $this->assertAuthenticatedAs($teacher);
    }
}
