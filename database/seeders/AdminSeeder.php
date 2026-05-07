<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'full_name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'birthday' => '2000-01-01',
                'contact_no' => '09123456789',
                'affiliation' => 'System Admin',
                'role' => 'admin',
            ]
        );
    }
}