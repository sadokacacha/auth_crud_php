<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

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

    // POST /api/users
    
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => ['required', Rule::in(['admin','teacher','student'])],
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // Spatie role assignment
        $user->assignRole($data['role']);

        return response()->json($user, 201);
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





}
