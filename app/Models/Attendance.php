<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
protected $fillable = ['schedule_id', 'teacher_id', 'date', 'hours', 'status'];

    public function schedule() {
        return $this->belongsTo(Schedule::class);
    }

    public function teacher()
{
    return $this->hasOneThrough(Teacher::class, Schedule::class, 'id', 'id', 'schedule_id', 'teacher_id');
}
}
// Compare this snippet from app/Models/Schedule.php: