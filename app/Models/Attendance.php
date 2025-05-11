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
public function subject()
{
    // via schedule → subject
    return $this->hasOneThrough(
      Subject::class,
      Schedule::class,
      'id',           // schedules.id
      'id',           // subjects.id
      'schedule_id',  // attendances.schedule_id
      'subject_id'    // schedules.subject_id
    );
}
}