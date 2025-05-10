<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;

class TeacherPaymentController extends Controller
{
    // Payment summary for teacher
    public function summary($teacherId)
    {
        $teacher = User::findOrFail($teacherId);

        // Replace this with actual unpaid sessions logic from schedule or attendance
        $unpaidPayments = Payment::where('user_id', $teacherId)
            ->where('type', 'teacher')
            ->where('status', 'pending')
            ->get();

        $total = $unpaidPayments->sum('amount');

        return response()->json([
            'teacher' => $teacher->only(['id', 'name', 'email']),
            'unpaid_payments' => $unpaidPayments,
            'total_due' => $total,
        ]);
    }

    // Mark teacher payments as paid
    public function markAsPaid(Request $request)
    {
        $data = $request->validate([
            'payment_ids' => 'required|array',
            'payment_ids.*' => 'exists:payments,id',
        ]);

        Payment::whereIn('id', $data['payment_ids'])->update(['status' => 'paid']);

        return response()->json([
            'message' => 'Payments marked as paid.',
        ]);
    }

    // History of all teacher payments
    public function history($teacherId)
    {
        $teacher = User::findOrFail($teacherId);

        $payments = Payment::where('user_id', $teacherId)
            ->where('type', 'teacher')
            ->get();

        return response()->json([
            'teacher' => $teacher->only(['id', 'name', 'email']),
            'payments' => $payments,
        ]);
    }
}
