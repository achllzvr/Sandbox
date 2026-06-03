<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\EnrollmentRequest;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class TeacherBulkCheckoutTest extends TestCase
{
    protected User $teacher;

    protected Certification $certification;

    protected function setUp(): void
    {
        parent::setUp();

        if (! Schema::hasTable('enrollment_requests') || ! Schema::hasColumn('users', 'role')) {
            $this->markTestSkipped('Sandbox commerce schema is required for teacher bulk checkout tests.');
        }

        config([
            'xendit.secret_key' => 'xnd_development_test_key',
            'xendit.webhook_token' => 'my-secret-token',
        ]);

        $this->teacher = User::create([
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane.doe@example.com',
            'password' => bcrypt('password'),
            'role' => 'teacher',
            'is_active' => true,
            'status' => 'active',
        ]);

        $this->certification = Certification::create([
            'title' => 'Web Dev 101',
            'description' => 'Basics of Web Dev',
            'category' => 'Technology',
            'difficulty' => 'Beginner',
            'price' => 1500.00,
            'pass_threshold' => 75,
            'status' => 'published',
            'created_by_user_id' => $this->teacher->id,
        ]);
    }

    public function test_only_teachers_can_checkout_bulk_vouchers(): void
    {
        $student = User::create([
            'first_name' => 'Alex',
            'last_name' => 'Smith',
            'email' => 'alex.smith@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
            'is_active' => true,
            'status' => 'active',
        ]);

        $this->actingAs($student);

        $response = $this->post(route('teacher.checkout.bulk'), [
            'certification_id' => $this->certification->id,
            'quantity' => 5,
            'expected_total' => 7500,
        ]);

        $response->assertStatus(403);
    }

    public function test_checkout_validation_rules(): void
    {
        $this->actingAs($this->teacher);

        $response = $this->post(route('teacher.checkout.bulk'), [
            'certification_id' => $this->certification->id,
            'quantity' => 0,
            'expected_total' => 0,
        ]);

        $response->assertSessionHasErrors('quantity');
    }

    public function test_successful_checkout_creates_pending_request_and_redirects_to_xendit(): void
    {
        $this->actingAs($this->teacher);

        Http::fake([
            'https://api.xendit.co/v2/invoices' => Http::response([
                'id' => 'inv_123',
                'invoice_url' => 'https://checkout.xendit.co/web/invoices/inv_123',
            ], 200),
        ]);

        $response = $this->post(route('teacher.checkout.bulk'), [
            'certification_id' => $this->certification->id,
            'quantity' => 10,
            'expected_total' => 15000,
        ]);

        $response->assertRedirect(route('teacher.shop.index'));
        $response->assertSessionHas('xendit_checkout_url', 'https://checkout.xendit.co/web/invoices/inv_123');

        $this->assertDatabaseHas('enrollment_requests', [
            'user_id' => $this->teacher->id,
            'certification_id' => $this->certification->id,
            'request_type' => 'teacher_bulk',
            'quantity' => 10,
            'amount' => 15000.00,
            'status' => 'pending',
            'xendit_invoice_id' => 'inv_123',
        ]);
    }

    public function test_webhook_unauthorized_token(): void
    {
        $response = $this->withHeaders([
            'x-callback-token' => 'invalid-token',
        ])->postJson('/api/webhooks/xendit', [
            'external_id' => 'SBX-TCH-12345',
            'status' => 'PAID',
        ]);

        $response->assertStatus(401);
    }

    public function test_webhook_success_paid_flow(): void
    {
        $enrollmentRequest = EnrollmentRequest::create([
            'user_id' => $this->teacher->id,
            'certification_id' => $this->certification->id,
            'request_type' => 'teacher_bulk',
            'quantity' => 3,
            'amount' => 4500.00,
            'status' => 'pending',
            'payment_reference' => 'SBX-TCH-TESTREF123',
            'xendit_invoice_id' => 'xendit_inv_123',
            'requested_at' => now(),
        ]);

        $response = $this->withHeaders([
            'x-callback-token' => 'my-secret-token',
        ])->postJson('/api/webhooks/xendit', [
            'id' => 'xendit_inv_123',
            'payment_id' => 'xendit_pay_789',
            'external_id' => 'SBX-TCH-TESTREF123',
            'status' => 'PAID',
            'payment_method' => 'EWALLET',
            'amount' => 4500.00,
        ]);

        $response->assertStatus(200);
        $response->assertJson(['status' => 'success']);

        $this->assertDatabaseHas('enrollment_requests', [
            'id' => $enrollmentRequest->id,
            'status' => 'paid',
            'payment_method' => 'EWALLET',
        ]);

        $this->assertEquals(3, Voucher::where('enrollment_request_id', $enrollmentRequest->id)->count());
    }

    public function test_free_certification_checkout_provisions_vouchers_without_xendit(): void
    {
        $this->actingAs($this->teacher);

        $freeCert = Certification::create([
            'title' => 'Free Shell',
            'description' => 'No-cost shell for bulk voucher testing',
            'category' => 'Demo',
            'difficulty' => 'Beginner',
            'price' => 0.00,
            'pass_threshold' => 70,
            'status' => 'published',
            'created_by_user_id' => $this->teacher->id,
        ]);

        $response = $this->post(route('teacher.checkout.bulk'), [
            'certification_id' => $freeCert->id,
            'quantity' => 3,
            'expected_total' => 0,
        ]);

        $response->assertRedirect(route('teacher.shop.index'));
        $this->assertEquals(3, Voucher::where('teacher_id', $this->teacher->id)->count());
        $this->assertDatabaseHas('enrollment_requests', [
            'user_id' => $this->teacher->id,
            'certification_id' => $freeCert->id,
            'status' => 'paid',
        ]);
    }

    public function test_return_url_syncs_paid_invoice_from_xendit(): void
    {
        $this->actingAs($this->teacher);

        $enrollmentRequest = EnrollmentRequest::create([
            'user_id' => $this->teacher->id,
            'certification_id' => $this->certification->id,
            'request_type' => 'teacher_bulk',
            'quantity' => 2,
            'amount' => 3000.00,
            'status' => 'pending',
            'payment_reference' => 'SBX-TCH-RETURN123',
            'xendit_invoice_id' => 'inv_return_123',
            'requested_at' => now(),
        ]);

        Http::fake([
            'https://api.xendit.co/v2/invoices/inv_return_123' => Http::response([
                'id' => 'inv_return_123',
                'external_id' => 'SBX-TCH-RETURN123',
                'status' => 'PAID',
                'payment_method' => 'QRIS',
                'amount' => 3000.00,
            ], 200),
        ]);

        $response = $this->get(route('teacher.shop.index', [
            'payment_reference' => 'SBX-TCH-RETURN123',
        ]));

        $response->assertOk();
        $this->assertDatabaseHas('enrollment_requests', [
            'id' => $enrollmentRequest->id,
            'status' => 'paid',
        ]);
        $this->assertEquals(2, Voucher::where('enrollment_request_id', $enrollmentRequest->id)->count());
    }
}
