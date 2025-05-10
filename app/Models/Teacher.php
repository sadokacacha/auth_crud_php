<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'hourly_rate',
        'payment_method',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subjects()
{
    return $this->belongsToMany(
        Subject::class,
        'subject_teacher',
        'teacher_id',
        'subject_id'
    );
}

public function classrooms()
{
    return $this->belongsToMany(
        Classroom::class,
        'classroom_teacher',
        'teacher_id',
        'classroom_id'
    );
}

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
