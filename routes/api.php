<?php

use App\Http\Controllers\AuthController;

use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\TeacherDashboardController;
use App\Http\Controllers\Api\StudentDashboardController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'Logout']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
// routes/api.php

    Route::middleware('role:admin')->get('/admin/dashboard', [AdminDashboardController::class, 'index']);
    Route::middleware('role:teacher')->get('/teacher/dashboard', [TeacherDashboardController::class, 'index']);
    Route::middleware('role:student')->get('/student/dashboard', [StudentDashboardController::class, 'index']);
});
