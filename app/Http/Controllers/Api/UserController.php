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
    $user = User::with('roles')->findOrFail($id);
    $role = $user->roles->pluck('name')->first();

    $base = [
      'id'    => $user->id,
      'name'  => $user->name,
      'email' => $user->email,
      'role'  => $role,
    ];

    // teacher
    if ($role === 'teacher') {
        $teacher = $user->teacher;
        $modules = [];
        $total   = 0;
        foreach ($teacher->subjects as $sub) {
            $done    = $sub->pivot->hours_done;
            $totalH  = $sub->total_hours;
            $price   = $done * $teacher->hourly_rate;
            $modules[] = [
              'name'           => $sub->name,
              'hours_done'     => $done,
              'hours_required' => $totalH,
              'price'          => $price,
            ];
            $total += $price;
        }
        $payments = Payment::where('user_id', $user->id)
                           ->orderBy('date','desc')
                           ->get();

        return response()->json(array_merge($base, [
          'payment_method' => $teacher->payment_method,
          'modules'        => $modules,
          'total_due'      => $total,
          'payments'       => $payments,
        ]));
    }

    // student or admin
    return response()->json($base);
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
