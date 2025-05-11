<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\Classroom;
use Illuminate\Support\Facades\DB;

class TeacherAssignmentSeeder extends Seeder
{
    public function run(): void
    {
        $teacher = Teacher::first();
        if (! $teacher) {
            $this->command->warn('No Teacher found—skipping TeacherAssignmentSeeder');
            return;
        }

        $subjectIds = Subject::inRandomOrder()->take(3)->pluck('id')->toArray();
        $classroomIds = Classroom::inRandomOrder()->take(2)->pluck('id')->toArray();

        // Sync the simpler pivot tables if needed
        $teacher->subjects()->sync($subjectIds);
        $teacher->classrooms()->sync($classroomIds);

        // Now insert into the triple pivot: classroom_subject_teacher
        foreach ($classroomIds as $classroomId) {
            foreach ($subjectIds as $subjectId) {
                DB::table('classroom_subject_teacher')->insert([
                    'teacher_id' => $teacher->id,
                    'classroom_id' => $classroomId,
                    'subject_id' => $subjectId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info("Assigned subjects and classrooms (with combined pivot) to Teacher #{$teacher->id}");
    }
}
