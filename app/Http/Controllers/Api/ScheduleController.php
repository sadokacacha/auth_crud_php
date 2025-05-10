<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Schedule;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    // GET /api/schedules
    public function index()
    {
        $schedules = Schedule::with('teacher.user', 'classroom')->get();
        return response()->json($schedules);
    }

    // POST /api/schedules
    public function store(Request $request)
    {
        $data = $request->validate([
            'teacher_id'   => 'required|exists:teachers,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'day'          => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
            'start_time'   => 'required|date_format:H:i',
            'end_time'     => 'required|date_format:H:i|after:start_time',
        ]);

        $schedule = Schedule::create($data);
        return response()->json($schedule->load('teacher.user', 'classroom'), 201);
    }

    // GET /api/schedules/classroom/{id}
    public function getByClassroom($id)
    {
        $schedules = Schedule::where('classroom_id', $id)->with('teacher.user')->get();
        return response()->json($schedules);
    }

    // GET /api/schedules/teacher/{id}
    public function getByTeacher($id)
    {
        $schedules = Schedule::where('teacher_id', $id)->with('classroom')->get();
        return response()->json($schedules);
    }

    // DELETE /api/schedules/{id}
    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();
        return response()->json(null, 204);
    }



public function today()
{
    $today = Carbon::now()->format('Y-m-d');
    $dayName = strtolower(Carbon::now()->format('l')); // e.g. monday

    $schedules = Schedule::with(['teacher', 'subject', 'classroom'])
        ->where('day', $dayName)
        ->get();

    return response()->json($schedules);
}



public function update(Request $request, $id)
{
    $schedule = Schedule::findOrFail($id);
    $data = $request->validate([
        'start_time' => 'nullable|date_format:H:i',
        'end_time' => 'nullable|date_format:H:i',
        'day' => 'nullable|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday'
    ]);
    $schedule->update($data);
    return response()->json($schedule);
}




}
