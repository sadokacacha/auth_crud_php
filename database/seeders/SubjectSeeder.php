<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run()
    {
        $subjects = ['Math', 'Science', 'History', 'English', 'Art'];

        foreach ($subjects as $subject) {
            Subject::create(['name' => $subject]);
        }
    }
}

