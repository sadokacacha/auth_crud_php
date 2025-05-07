<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\Classroom;
use App\Models\Payment;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $roles = ['admin', 'teacher', 'student'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        // Create subjects
        $subjects = ['Math', 'Science', 'History', 'English', 'Art'];
        foreach ($subjects as $subject) {
            Subject::firstOrCreate(['name' => $subject]);
        }

        // Create classrooms
        $classrooms = ['1A', '1B', '2A', '2B', '3A'];
        foreach ($classrooms as $classroom) {
            Classroom::firstOrCreate(['name' => $classroom]);
        }

        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin User', 'password' => Hash::make('password')]
        );
        $admin->assignRole('admin');

        // Create teacher user
        $teacherUser = User::firstOrCreate(
            ['email' => 'teacher@example.com'],
            ['name' => 'Teacher Lisa', 'password' => Hash::make('password')]
        );
        $teacherUser->assignRole('teacher');

        // Create associated teacher profile
        $teacher = Teacher::firstOrCreate(
            ['user_id' => $teacherUser->id],
            ['hourly_rate' => 50, 'payment_method' => 'bank']
        );

        // Assign subjects to teacher
        $math = Subject::where('name', 'Math')->first();
        $english = Subject::where('name', 'English')->first();
        $teacher->subjects()->sync([$math->id, $english->id]);

        // Assign classrooms to teacher
        $classroom1 = Classroom::where('name', '1A')->first();
        $classroom2 = Classroom::where('name', '2B')->first();
        $teacher->classrooms()->sync([$classroom1->id, $classroom2->id]);

        // Create student user
        $studentUser = User::firstOrCreate(
            ['email' => 'student@example.com'],
            ['name' => 'Student Tom', 'password' => Hash::make('password')]
        );
        $studentUser->assignRole('student');

        // Attach student to a classroom (optional)
        $classroom1->students()->attach($studentUser->id); // only if you implement it

        // Add payment records for teacher
        Payment::create([
            'user_id' => $teacherUser->id,
            'amount' => 1250,
            'date' => now()->subMonths(3),
            'status' => 'completed',
        ]);
        Payment::create([
            'user_id' => $teacherUser->id,
            'amount' => 1250,
            'date' => now()->subMonths(2),
            'status' => 'completed',
        ]);
        Payment::create([
            'user_id' => $teacherUser->id,
            'amount' => 1250,
            'date' => now()->subMonth(),
            'status' => 'pending',
        ]);
    }
}
