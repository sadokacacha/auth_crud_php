<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = ['teacher_id', 'classroom_id', 'day', 'start_time', 'end_time'];

    public function teacher() {
        return $this->belongsTo(Teacher::class);
    }

    public function classroom() {
        return $this->belongsTo(Classroom::class);
    }
}