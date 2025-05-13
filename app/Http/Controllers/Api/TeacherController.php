<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index()
    {
        $teachers = Teacher::with('user', 'subjects', 'classrooms')->get();
        return response()->json($teachers);
    }

   public function store(Request $request)
{
    $data = $request->validate([
      'user_id'           => 'required|exists:users,id',
      'hourly_rate'       => 'required|numeric',
      'payment_method'    => 'required|in:check,cash,bank',
      'subjects'          => 'array',
      'subjects.*'        => 'exists:subjects,id',
      'classroom_subjects'   => 'required|array',
      'classroom_subjects.*.classroom_id' => 'required|exists:classrooms,id',
      'classroom_subjects.*.subject_ids'  => 'required|array',
      'classroom_subjects.*.subject_ids.*'=> 'exists:subjects,id',
    ]);

    // 1) Create the Teacher
    $teacher = Teacher::create([
      'user_id'        => $data['user_id'],
      'hourly_rate'    => $data['hourly_rate'],
      'payment_method' => $data['payment_method'],
    ]);

    // 2) Sync plain subjects (for quick lookup/filter)
    $teacher->subjects()->sync($data['subjects'] ?? []);


    $attach = [];
    foreach ($data['classroom_subjects'] as $cs) {
      foreach ($cs['subject_ids'] as $subId) {
        $attach[] = [
          'classroom_id' => $cs['classroom_id'],
          'subject_id'   => $subId,
        ];
      }
    }
    // detach existing to avoid dupes, then re-attach
    $teacher->classrooms()->detach();
    foreach ($attach as $pivot) {
      $teacher->classrooms()->attach($pivot['classroom_id'], [
        'subject_id' => $pivot['subject_id'],
      ]);
    }

    return response()->json($teacher->load('subjects','classrooms'), 201);
}

    public function show($id)
    {
        $teacher = Teacher::with('user', 'subjects', 'classrooms')->findOrFail($id);
        return response()->json($teacher);
    }

    public function update(Request $request, $id)
    {
        $teacher = Teacher::findOrFail($id);

        $data = $request->validate([
            'hourly_rate'     => 'sometimes|numeric',
            'payment_method'  => 'sometimes|in:check,cash,bank',
            'subjects'        => 'array',
            'subjects.*'      => 'exists:subjects,id',
            'classrooms'      => 'array',
            'classrooms.*'    => 'exists:classrooms,id',
        ]);

        $teacher->update($data);

        if (isset($data['subjects'])) {
            $teacher->subjects()->sync($data['subjects']);
        }

        if (isset($data['classrooms'])) {
            $teacher->classrooms()->sync($data['classrooms']);
        }

        return response()->json($teacher->load('subjects', 'classrooms'));
    }

    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);
        $teacher->delete();

        return response()->json(null, 204);
    }
}
