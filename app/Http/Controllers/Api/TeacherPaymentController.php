<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TeacherPaymentController extends Controller
{
    public function index()
    {
        // Get current month
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        // Get all teachers
        $teachers = Teacher::with(['user', 'schedules', 'schedules.attendances'])->get();

        $teacherPayments = [];

        foreach ($teachers as $teacher) {
            // Get attendances for this teacher in the current month
            $totalHours = Attendance::whereHas('schedule', function ($query) use ($teacher) {
                    $query->where('teacher_id', $teacher->id);
                })
                ->whereMonth('date', $currentMonth)
                ->whereYear('date', $currentYear)
                ->sum('hours');

            // Calculate payment
            $hourlyRate = $teacher->hourly_rate ?? 0;
            $paymentDue = $totalHours * $hourlyRate;

            $teacherPayments[] = [
                'teacher_name' => $teacher->user->name,
                'hourly_rate' => $hourlyRate,
                'total_hours' => $totalHours,
                'payment_due' => $paymentDue,
            ];
        }

        return response()->json([
            'month' => Carbon::now()->format('F Y'),
            'teacher_payments' => $teacherPayments,
        ]);
    }
}
