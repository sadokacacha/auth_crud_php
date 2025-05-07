<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Subject;
use App\Models\Classroom;
use Illuminate\Database\Seeder;

class TeacherAssignmentSeeder extends Seeder
{
    public function run(): void
    {
        $teacher = User::whereHas('roles', fn ($q) => $q->where('name', 'teacher'))->first();

        $subjects = Subject::inRandomOrder()->take(3)->pluck('id');
        $classrooms = Classroom::inRandomOrder()->take(2)->pluck('id');

        $teacher->subjects()->sync($subjects);
        $teacher->classrooms()->sync($classrooms);

        $teacher->hourly_rate = 50;
        $teacher->payment_method = 'bank';
        $teacher->save();
    }
}
