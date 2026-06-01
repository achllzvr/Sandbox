<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\EnrollmentRequest;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TeacherBulkCheckoutTest extends TestCase
{
    use RefreshDatabase;

    protected $teacher;
    protected $certification;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a teacher user
        $this->teacher = User::create([
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane.doe@example.com',
            'password' => bcrypt('password'),
            'role' => 'teacher',
        ]);

        // Create a published certification
        $this->certification = Certification::create([
            'title' => 'Web Dev 101',
            'description' => 'Basics of Web Dev',
            'price' => 1500.00,
            'pass_threshold' => 75,
            'status' => 'published',
            'created_by' => 1,
        ]);
    }

    public function test_only_teachers_can_checkout_bulk_vouchers()
    {
        // 1. Non-teacher attempts checkout
        $student = User::create([
            'first_name' => 'Alex',
            'last_name' => 'Smith',
            'email' => 'alex.smith@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);

        $this->actingAs($student);

        $response = $this->post(route('teacher.checkout.bulk'), [
            'certification_id' => $this->certification->id,
            'quantity' => 5,
        ]);

        // Should return a forbidden/unauthorized state
        $response->assertStatus(403);
    }

    public function test_checkout_validation_rules()
    {
        $this->actingAs($this->teacher);

        // Required and min value validation for quantity
        $response = $this->post(route('teacher.checkout.bulk'), [
            'certification_id' => $this->certification->id,
            'quantity' => 0,
        ]);

        $response->assertSessionHasErrors('quantity');

        // Invalid certification validation
        $response = $this->post(route('teacher.checkout.bulk'), [
            'certification_id' => 9999,
            'quantity' => 5,
        ]);

        $response->assertSessionHasErrors('certification_id');
    }

    public function test_successful_checkout_creates_pending_request_and_redirects()
    {
        $this->actingAs($this->teacher);

        // Fake the Xendit Invoice creation API call
        Http::fake([
            'https://api.xendit.co/v2/invoices' => Http::response([
                'id' => 'inv_123',
                'invoice_url' => 'https://checkout.xendit.co/v2/invoices/inv_123',
            ], 200)
        ]);

        $response = $this->post(route('teacher.checkout.bulk'), [
            'certification_id' => $this->certification->id,
            'quantity' => 10,
        ]);

        // In standard actingAs, Inertia returns location redirection header
        $response->assertStatus(409); // Inertia location code is typically 409 Conflict
        
        // Assert database record exists
        $this->assertDatabaseHas('enrollment_requests', [
            'user_id' => $this->teacher->id,
            'certification_id' => $this->certification->id,
            'request_type' => 'teacher_bulk',
            'quantity' => 10,
            'amount' => 15000.00,
            'status' => 'pending',
        ]);
    }

    public function test_webhook_unauthorized_token()
    {
        $response = $this->withHeaders([
            'x-callback-token' => 'invalid-token',
        ])->postJson('/api/webhooks/xendit', [
            'external_id' => 'SBX-TCH-12345',
            'status' => 'PAID',
        ]);

        $response->assertStatus(401);
    }

    public function test_webhook_success_paid_flow()
    {
        // 1. Create a pending enrollment request
        $enrollmentRequest = EnrollmentRequest::create([
            'user_id' => $this->teacher->id,
            'certification_id' => $this->certification->id,
            'request_type' => 'teacher_bulk',
            'quantity' => 3,
            'amount' => 4500.00,
            'status' => 'pending',
            'payment_reference' => 'SBX-TCH-TESTREF123',
            'requested_at' => now(),
        ]);

        // Configure the webhook token in env
        putenv('XENDIT_WEBHOOK_TOKEN=my-secret-token');

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

        // Assert database state updates
        $this->assertDatabaseHas('enrollment_requests', [
            'id' => $enrollmentRequest->id,
            'status' => 'paid',
            'payment_method' => 'EWALLET',
        ]);

        // Assert payment record creation
        $this->assertDatabaseHas('payments', [
            'enrollment_request_id' => $enrollmentRequest->id,
            'provider' => 'xendit',
            'provider_invoice_id' => 'xendit_inv_123',
            'provider_reference' => 'xendit_pay_789',
            'amount' => 4500.00,
            'status' => 'paid',
            'method' => 'EWALLET',
        ]);

        // Assert cohort provisioning
        $this->assertDatabaseHas('cohorts', [
            'teacher_id' => $this->teacher->id,
            'certification_id' => $this->certification->id,
            'cohort_name' => 'Batch ' . date('M j, Y'),
        ]);

        // Assert voucher generation
        $this->assertEquals(3, Voucher::where('enrollment_request_id', $enrollmentRequest->id)->count());
        $vouchers = Voucher::where('enrollment_request_id', $enrollmentRequest->id)->get();
        foreach ($vouchers as $voucher) {
            $this->assertStringStartsWith('TCH-', $voucher->code);
            $this->assertFalse($voucher->is_used);
            $this->assertEquals($this->teacher->id, $voucher->teacher_id);
        }
    }

    public function test_simulate_success_flow()
    {
        $this->actingAs($this->teacher);

        // 1. Create a pending enrollment request
        $enrollmentRequest = EnrollmentRequest::create([
            'user_id' => $this->teacher->id,
            'certification_id' => $this->certification->id,
            'request_type' => 'teacher_bulk',
            'quantity' => 5,
            'amount' => 7500.00,
            'status' => 'pending',
            'payment_reference' => 'SBX-TCH-SIMTEST123',
            'requested_at' => now(),
        ]);

        $response = $this->post(route('teacher.checkout.simulate-success', $enrollmentRequest->id));

        // It should redirect to teacher.dashboard
        $response->assertRedirect(route('teacher.dashboard'));

        // Assert database state updates
        $this->assertDatabaseHas('enrollment_requests', [
            'id' => $enrollmentRequest->id,
            'status' => 'paid',
            'payment_method' => 'SIMULATED',
        ]);

        // Assert payment record creation
        $this->assertDatabaseHas('payments', [
            'enrollment_request_id' => $enrollmentRequest->id,
            'provider' => 'simulated',
            'status' => 'paid',
            'method' => 'SIMULATED',
        ]);

        // Assert cohort provisioning
        $this->assertDatabaseHas('cohorts', [
            'teacher_id' => $this->teacher->id,
            'certification_id' => $this->certification->id,
            'cohort_name' => 'Batch ' . date('M j, Y') . ' (Simulated)',
        ]);

        // Assert voucher generation
        $this->assertEquals(5, Voucher::where('enrollment_request_id', $enrollmentRequest->id)->count());
        $vouchers = Voucher::where('enrollment_request_id', $enrollmentRequest->id)->get();
        foreach ($vouchers as $voucher) {
            $this->assertStringStartsWith('TCH-', $voucher->code);
            $this->assertFalse($voucher->is_used);
            $this->assertEquals($this->teacher->id, $voucher->teacher_id);
        }
    }
}
