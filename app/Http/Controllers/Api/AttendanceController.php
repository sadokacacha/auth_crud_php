<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Payment;
use Illuminate\Http\Request;
use App\Models\Schedule;


class AttendanceController extends Controller
{










    
    public function today()
    {
        $today = now()->toDateString();
        return Attendance::with('schedule.teacher.user','schedule.classroom','schedule.subject')
            ->where('date', $today)
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'schedule_id'=>'required|exists:schedules,id',
            'date'=>'required|date',
            'status'=>'required|in:present,absent',
            'hours'=>'required_if:status,present|numeric|min:0'
        ]);

        $attendance = Attendance::updateOrCreate(
            ['schedule_id'=>$data['schedule_id'],'date'=>$data['date']],
            $data
        );

        // Optional: create payment if present
        if ($data['status'] === 'present') {
            $rate = $attendance->schedule->teacher->hourly_rate;
            Payment::create([
                'user_id' => $attendance->schedule->teacher->user_id,
                'amount'  => $rate * $data['hours'],
                'date'    => $data['date'],
                'status'  => 'pending'
            ]);
        }

        return response()->json($attendance, 201);
    }

    public function update(Request $request, Attendance $attendance)
    {
        $data = $request->validate([
            'status'=>'sometimes|in:present,absent',
            'hours'=>'sometimes|numeric|min:0'
        ]);

        $attendance->update($data);

        return response()->json($attendance);
    }


public function mark(Request $request)
{
    $data = $request->validate([
        'schedule_id' => 'required|exists:schedules,id',
        'teacher_id'  => 'required|exists:teachers,id',
        'date'        => 'required|date',
        'status'      => 'required|in:present,absent',
        'hours'       => 'required_if:status,present|numeric|min:1',
    ]);

    // reject if already present today
    $existing = Attendance::where([
        ['schedule_id',$data['schedule_id']],
        ['teacher_id', $data['teacher_id']],
        ['date',       $data['date']],
    ])->first();

    if ($existing && $existing->status==='present' && $data['status']==='present') {
        return response()->json(['message'=>'Already marked present today'], 422);
    }

    $attendance = Attendance::updateOrCreate(
        ['schedule_id'=>$data['schedule_id'],'teacher_id'=>$data['teacher_id'],'date'=>$data['date']],
        ['status'=>$data['status'],'hours'=>$data['hours'] ?? 0]
    );

    return response()->json($attendance);
}

public function index(Request $request)
{
    $from = $request->input('from');
    $to = $request->input('to');

    $teachers = User::where('role', 'teacher')->with(['schedules' => function ($q) use ($from, $to) {
        $q->whereBetween('start_time', [$from, $to])
          ->with('attendance', 'subject', 'classroom');
    }])->get();

    return response()->json($teachers);
}
}
