<?php

namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // ← Add this line
use Spatie\Permission\Traits\HasRoles; // ← Also for Spatie roles

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable , HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

}