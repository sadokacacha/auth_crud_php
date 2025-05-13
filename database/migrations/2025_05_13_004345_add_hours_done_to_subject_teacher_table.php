<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('subject_teacher', function (Blueprint $table) {
            $table->integer('hours_done')->default(0)->after('teacher_id');
        });
    }

    public function down(): void
    {
        Schema::table('subject_teacher', function (Blueprint $table) {
            $table->dropColumn('hours_done');
        });
    }
};
