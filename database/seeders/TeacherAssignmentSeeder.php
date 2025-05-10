<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\Classroom;

class TeacherAssignmentSeeder extends Seeder
{
    public function run(): void
    {
        // Grab the first teacher record (or adjust to find a specific one)
        $teacher = Teacher::first();
        if (! $teacher) {
            $this->command->warn('No Teacher found—skipping TeacherAssignmentSeeder');
            return;
        }

        // 1) Sync 3 random subjects via subject_teacher pivot:
        $subjectIds = Subject::inRandomOrder()->take(3)->pluck('id')->toArray();
        $teacher->subjects()->sync($subjectIds);

        // 2) Sync 2 random classrooms via classroom_teacher pivot:
        $classroomIds = Classroom::inRandomOrder()->take(2)->pluck('id')->toArray();
        $teacher->classrooms()->sync($classroomIds);

        $this->command->info("Assigned subjects and classrooms to Teacher #{$teacher->id}");
    }
}
