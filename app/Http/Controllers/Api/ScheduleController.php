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
        $schedules = Schedule::with('teacher.user', 'classroom', 'subject')->get();
        return response()->json($schedules);
    }

    // POST /api/schedules
    public function store(Request $request)
    {
        $data = $request->validate([
            'teacher_id'   => 'required|exists:teachers,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id'   => 'required|exists:subjects,id', // make sure this is required
            'day'          => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
            'start_time'   => 'required|date_format:H:i',
            'end_time'     => 'required|date_format:H:i|after:start_time',
        ]);

        $schedule = Schedule::create($data);
        return response()->json($schedule->load('teacher.user', 'classroom', 'subject'), 201); // ✅ include subject
    }

    // GET /api/schedules/classroom/{id}
    public function getByClassroom($id)
    {
        $schedules = Schedule::where('classroom_id', $id)
            ->with('teacher.user', 'subject') // ✅ added subject
            ->get();
        return response()->json($schedules);
    }

    // GET /api/schedules/teacher/{id}
    public function getByTeacher($id)
    {
        $schedules = Schedule::where('teacher_id', $id)
            ->with('classroom', 'subject') // ✅ added subject
            ->get();
        return response()->json($schedules);
    }

    // DELETE /api/schedules/{id}
    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();
        return response()->json(null, 204);
    }

    // GET /api/schedules/today
    public function today()
    {
        $dayName = strtolower(Carbon::now()->format('l')); // e.g. monday

        $schedules = Schedule::with(['teacher', 'subject', 'classroom'])
            ->where('day', $dayName)
            ->get();

        return response()->json($schedules);
    }

    // PUT /api/schedules/{id}
    public function update(Request $request, $id)
    {
        $schedule = Schedule::findOrFail($id);
        $data = $request->validate([
            'start_time' => 'nullable|date_format:H:i',
            'end_time'   => 'nullable|date_format:H:i|after:start_time',
            'day'        => 'nullable|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        ]);
        $schedule->update($data);
        return response()->json($schedule->load('teacher.user', 'classroom', 'subject')); // ✅ include subject
    }
}
