<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\Classroom;
use App\Models\Schedule;
use App\Models\Attendance;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    // GET /api/users
    public function index()
    {
        $users = User::with('roles')->get();
    
        $users = $users->map(function($user) {
            return [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->roles->pluck('name')->first(), // get first role
            ];
        });
    
        return response()->json($users);
    }





    // GET /api/users/{id}
public function show($id)
{
    $user = User::with('roles','teacher')->findOrFail($id);

    // base shape
    $out = [
      'id'    => $user->id,
      'name'  => $user->name,
      'email' => $user->email,
      'role'  => $user->roles->pluck('name')->first(),
    ];

    if ($out['role'] === 'teacher') {
        $teacherId = $user->teacher->id;

        // 1) total hours taught
        $totalHours = Attendance::where('teacher_id', $teacherId)
                        ->where('status','present')
                        ->sum('hours');

        // 2) total payments (teacher)
        $totalPayments = Payment::where('user_id', $user->id)
                          ->where('type','teacher')
                          ->sum('amount');

        // 3) hours per subject
        $hoursPerSubject = DB::table('attendances')
            ->join('schedules','attendances.schedule_id','=','schedules.id')
            ->join('subjects','schedules.subject_id','=','subjects.id')
            ->select(
                'subjects.id   as subject_id',
                'subjects.name as subject_name',
                DB::raw('SUM(attendances.hours) as hours')
            )
            ->where('attendances.teacher_id',$teacherId)
            ->where('attendances.status','present')
            ->groupBy('subjects.id','subjects.name')
            ->get();

        $out['total_hours']       = $totalHours;
        $out['total_payments']    = $totalPayments;
        $out['payment_method']    = $user->teacher->payment_method;
        $out['hours_per_subject'] = $hoursPerSubject;
    }

    return response()->json($out);
}





    // POST /api/users
    
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'            => 'required|string|max:255',
            'email'           => 'required|email|unique:users,email',
            'password'        => 'required|string|min:6',
            'role'            => ['required', Rule::in(['admin','teacher','student'])],
            // Only for teachers
            'hourly_rate'     => 'nullable|numeric',
            'payment_method'  => 'nullable|string|in:cash,bank,check',
            'subjects'        => 'nullable|array',
            'subjects.*'      => 'exists:subjects,id',
            'classrooms'      => 'nullable|array',
            'classrooms.*'    => 'exists:classrooms,id',
        ]);
    
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    
        $user->assignRole($data['role']);
    
        if ($data['role'] === 'teacher') {
            $teacher = Teacher::create([
                'user_id'        => $user->id,
                'hourly_rate'    => $data['hourly_rate'] ?? 0,
                'payment_method' => $data['payment_method'] ?? 'cash',
            ]);
    
            $teacher->subjects()->sync($data['subjects'] ?? []);
            $teacher->classrooms()->sync($data['classrooms'] ?? []);
        }
    
        return response()->json($user->load('teacher.subjects', 'teacher.classrooms'), 201);
    }



    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
    
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'role'     => ['required', Rule::in(['admin', 'teacher', 'student'])],
        ]);
    
        $user->name = $data['name'];
        $user->email = $data['email'];
    
        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
    
        $user->save();
    
        // Update roles
        $user->syncRoles([$data['role']]);
    
        return response()->json($user);
    }
    



    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
    
        return response()->json(null, 204);
    }



    public function schedule($id)
    {
        $schedule = Schedule::with(['classroom', 'subject'])
            ->where('teacher_id', $id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get()
            ->map(function ($entry) {
                return [
                    'day' => $entry->day_of_week,
                    'start' => $entry->start_time,
                    'end' => $entry->end_time,
                    'classroom' => $entry->classroom->name,
                    'subject' => $entry->subject->name,
                ];
            });
    
        return response()->json($schedule);
    }

}
