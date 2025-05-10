<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;

class StudentPaymentController extends Controller
{
    // Create a student payment
    public function pay(Request $request)
    {
        $data = $request->validate([
            'student_id' => 'required|exists:users,id',
            'plan_type' => 'required|in:monthly,semester,full',
            'amount' => 'required|numeric|min:0',
            'method' => 'required|in:cash,check,bank',
            'date' => 'required|date',
        ]);

        $payment = Payment::create([
            'user_id' => $data['student_id'],
            'type' => 'student',
            'method' => $data['method'],
            'amount' => $data['amount'],
            'date' => $data['date'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Student payment recorded.',
            'data' => $payment,
        ], 201);
    }

    // Payment history for a student
    public function history($studentId)
    {
        $student = User::findOrFail($studentId);

        $payments = Payment::where('user_id', $studentId)
            ->where('type', 'student')
            ->get();

        return response()->json([
            'student' => $student->only(['id', 'name', 'email']),
            'payments' => $payments,
        ]);
    }
}
