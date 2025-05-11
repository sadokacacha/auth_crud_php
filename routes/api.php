<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\ClassroomController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\StudentPaymentController;
use App\Http\Controllers\Api\TeacherPaymentController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\TeacherDashboardController;
use App\Http\Controllers\Api\StudentDashboardController;

// Public route
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn(Request $request) => $request->user());

    // Dashboards (role-specific)
    Route::get('/admin/dashboard',   [AdminDashboardController::class, 'index'])->middleware('role:admin');
    Route::get('/teacher/dashboard', [TeacherDashboardController::class, 'index'])->middleware('role:teacher');
    Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])->middleware('role:student');

    // Admin-only routes
    Route::middleware('role:admin')->group(function () {
        // Resource management
        Route::apiResource('users', UserController::class);
    Route::apiResource('teachers', TeacherController::class);
    Route::apiResource('classrooms', ClassroomController::class);
    Route::apiResource('subjects', SubjectController::class);
    Route::apiResource('schedules', ScheduleController::class)->except(['show']);

    // Additional schedule routes
    Route::put('/schedules/{id}', [ScheduleController::class, 'update']);
    Route::delete('/schedules/{id}', [ScheduleController::class, 'destroy']);
    Route::post('/schedules/recurring', [ScheduleController::class, 'storeRecurring']);
    Route::put('/schedules/recurring', [ScheduleController::class, 'updateRecurring']);
    Route::delete('/schedules/recurring', [ScheduleController::class, 'deleteRecurring']);
    Route::get('/schedules/upcoming', [ScheduleController::class, 'upcomingWeek']);

    // Schedule and attendance
    Route::get('/emploi/today', [ScheduleController::class, 'today']);
    Route::get('/attendance/today', [AttendanceController::class, 'today']);
    Route::post('/attendance', [AttendanceController::class, 'store']);
    Route::put('/attendance/{att}', [AttendanceController::class, 'update']);
    Route::get('/attendance/history/{id}', [AttendanceController::class, 'history']);

    // Payments
    Route::apiResource('payments', PaymentController::class)->only(['store', 'update', 'destroy']);
    Route::get('/payments/user/{id}', [PaymentController::class, 'byUser']);

    // Student payments
    Route::post('/student-payments', [StudentPaymentController::class, 'store']);
    Route::get('/students/{id}/payments', [StudentPaymentController::class, 'byStudent']);

    // Teacher payment summaries
    Route::get('/teachers/{id}/payments/summary', [TeacherPaymentController::class, 'summary']);
    Route::get('/teachers/{id}/payments/history', [TeacherPaymentController::class, 'history']);
    });
});
