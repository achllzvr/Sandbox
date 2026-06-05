<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class AdminUsersIndexTest extends TestCase
{
    public function test_admin_users_index_renders_for_admin(): void
    {
        $admin = User::where('role', 'admin')->first();
        if (! $admin) {
            $this->markTestSkipped('No admin user in database.');
        }

        $response = $this->actingAs($admin)->get(route('admin.users.index'));

        $response->assertOk();
        $response->assertSee('data-page="', false);
        $response->assertSee('Admin\/Users\/Index', false);
    }
}
