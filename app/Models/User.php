<?php

namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;

use Laravel\Sanctum\HasApiTokens; // 👈 Add this
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles; // 👈 Add this
use Illuminate\Database\Eloquent\Factories\HasFactory;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

}