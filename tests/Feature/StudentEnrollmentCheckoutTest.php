<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\Enrollment;
use App\Models\EnrollmentRequest;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class StudentEnrollmentCheckoutTest extends TestCase
{
    protected User $student;

    protected Certification $certification;

    protected function setUp(): void
    {
        parent::setUp();

        if (! Schema::hasTable('enrollment_requests') || ! Schema::hasColumn('users', 'role')) {
            $this->markTestSkipped('Sandbox commerce schema is required for enrollment checkout tests.');
        }

        config([
            'xendit.secret_key' => 'xnd_development_test_key',
            'xendit.webhook_token' => 'my-secret-token',
        ]);

        $this->student = User::create([
            'first_name' => 'Alex',
            'last_name' => 'Smith',
            'email' => 'alex.smith@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
            'is_active' => true,
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $this->certification = Certification::create([
            'title' => 'Web Dev 101',
            'description' => 'Basics of Web Dev',
            'category' => 'Technology',
            'difficulty' => 'Beginner',
            'price' => 1500.00,
            'pass_threshold' => 75,
            'status' => 'published',
            'created_by_user_id' => $this->student->id,
        ]);
    }

    public function test_checkout_rejects_mismatched_expected_total(): void
    {
        $this->actingAs($this->student);

        $response = $this->post(route('student.enrollments.checkout'), [
            'certification_id' => $this->certification->id,
            'expected_total' => 999,
            'payment_method' => 'xendit',
            'tos_action_irreversible' => true,
            'tos_privacy_act' => true,
        ]);

        $response->assertSessionHasErrors('checkout');
    }

    public function test_successful_checkout_creates_pending_request_and_redirects_to_xendit(): void
    {
        $this->actingAs($this->student);

        Http::fake([
            'https://api.xendit.co/v2/invoices' => Http::response([
                'id' => 'inv_student_123',
                'invoice_url' => 'https://checkout.xendit.co/web/invoices/inv_student_123',
            ], 200),
        ]);

        $response = $this->post(route('student.enrollments.checkout'), [
            'certification_id' => $this->certification->id,
            'expected_total' => 1500,
            'payment_method' => 'xendit',
            'tos_action_irreversible' => true,
            'tos_privacy_act' => true,
        ]);

        $response->assertRedirect(route('marketplace.index'));
        $response->assertSessionHas('xendit_checkout_url', 'https://checkout.xendit.co/web/invoices/inv_student_123');

        $this->assertDatabaseHas('enrollment_requests', [
            'user_id' => $this->student->id,
            'certification_id' => $this->certification->id,
            'request_type' => 'direct_purchase',
            'quantity' => 1,
            'amount' => 1500.00,
            'status' => 'pending',
            'xendit_invoice_id' => 'inv_student_123',
        ]);
    }

    public function test_webhook_success_paid_direct_purchase_enrolls_student(): void
    {
        $enrollmentRequest = EnrollmentRequest::create([
            'user_id' => $this->student->id,
            'certification_id' => $this->certification->id,
            'request_type' => 'direct_purchase',
            'quantity' => 1,
            'amount' => 1500.00,
            'status' => 'pending',
            'payment_reference' => 'SBX-STU-TESTREF123',
            'xendit_invoice_id' => 'xendit_inv_student_123',
            'requested_at' => now(),
        ]);

        $response = $this->withHeaders([
            'x-callback-token' => 'my-secret-token',
        ])->postJson('/api/webhooks/xendit', [
            'id' => 'xendit_inv_student_123',
            'payment_id' => 'xendit_pay_student_789',
            'external_id' => 'SBX-STU-TESTREF123',
            'status' => 'PAID',
            'payment_method' => 'EWALLET',
            'amount' => 1500.00,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('enrollment_requests', [
            'id' => $enrollmentRequest->id,
            'status' => 'paid',
        ]);

        $this->assertDatabaseHas('enrollments', [
            'user_id' => $this->student->id,
            'certification_id' => $this->certification->id,
            'access_type' => 'direct_purchase',
            'status' => 'active',
        ]);
    }

    public function test_free_certification_checkout_enrolls_without_xendit(): void
    {
        $this->actingAs($this->student);

        $freeCert = Certification::create([
            'title' => 'Free Shell',
            'description' => 'No-cost shell',
            'category' => 'Demo',
            'difficulty' => 'Beginner',
            'price' => 0.00,
            'pass_threshold' => 70,
            'status' => 'published',
            'created_by_user_id' => $this->student->id,
        ]);

        $response = $this->post(route('student.enrollments.checkout'), [
            'certification_id' => $freeCert->id,
            'expected_total' => 0,
            'payment_method' => 'xendit',
            'tos_action_irreversible' => true,
            'tos_privacy_act' => true,
        ]);

        $response->assertRedirect(route('marketplace.index'));
        $response->assertSessionHas('shop_success', $freeCert->id);

        $this->assertTrue(
            Enrollment::where('user_id', $this->student->id)
                ->where('certification_id', $freeCert->id)
                ->where('status', 'active')
                ->exists()
        );
    }

    public function test_teacher_bulk_webhook_still_provisions_vouchers(): void
    {
        $teacher = User::create([
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane.doe@example.com',
            'password' => bcrypt('password'),
            'role' => 'teacher',
            'is_active' => true,
            'status' => 'active',
        ]);

        $enrollmentRequest = EnrollmentRequest::create([
            'user_id' => $teacher->id,
            'certification_id' => $this->certification->id,
            'request_type' => 'teacher_bulk',
            'quantity' => 2,
            'amount' => 3000.00,
            'status' => 'pending',
            'payment_reference' => 'SBX-TCH-TESTREF123',
            'xendit_invoice_id' => 'xendit_inv_123',
            'requested_at' => now(),
        ]);

        $this->withHeaders([
            'x-callback-token' => 'my-secret-token',
        ])->postJson('/api/webhooks/xendit', [
            'external_id' => 'SBX-TCH-TESTREF123',
            'status' => 'PAID',
            'amount' => 3000.00,
        ])->assertStatus(200);

        $this->assertEquals(2, Voucher::where('enrollment_request_id', $enrollmentRequest->id)->count());
    }
}
