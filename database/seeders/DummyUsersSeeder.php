<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DummyUsersSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin User', 'password' => bcrypt('password')]
        );
        $admin->assignRole('admin');

        $teacher = User::updateOrCreate(
            ['email' => 'teacher@example.com'],
            ['name' => 'Teacher User', 'password' => bcrypt('password')]
        );
        $teacher->assignRole('teacher');

        $student = User::updateOrCreate(
            ['email' => 'student@example.com'],
            ['name' => 'Student User', 'password' => bcrypt('password')]
        );
        $student->assignRole('student');
    }
}
