<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\TeacherDashboardController;
use App\Http\Controllers\Api\StudentDashboardController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\ScheduleController;



use App\Http\Controllers\Api\UserController;



use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'Login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'Logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::middleware('role:admin')->get('/admin/dashboard', [AdminDashboardController::class, 'index']);
    Route::middleware('role:teacher')->get('/teacher/dashboard', [TeacherDashboardController::class, 'index']);
    Route::middleware('role:student')->get('/student/dashboard', [StudentDashboardController::class, 'index']);


    Route::middleware(['auth:sanctum','role:admin'])->group(function () {
        Route::get('/users',        [UserController::class,'index']);
        Route::post('/users',       [UserController::class,'store']);
        Route::get('/users/{id}',   [UserController::class,'show']);    // ← new
        Route::put('/users/{id}',   [UserController::class,'update']);
        Route::delete('/users/{id}',[UserController::class,'destroy']);
    });
    
    Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
        Route::apiResource('teachers', TeacherController::class);
    });



    Route::get('/schedules', [ScheduleController::class, 'index']);
    Route::post('/schedules', [ScheduleController::class, 'store']);
    Route::get('/schedules/classroom/{id}', [ScheduleController::class, 'getByClassroom']);
    Route::get('/schedules/teacher/{id}', [ScheduleController::class, 'getByTeacher']);
    Route::delete('/schedules/{id}', [ScheduleController::class, 'destroy']);
    Route::get('/teachers/{id}/schedule', [UserController::class, 'schedule']);



});

