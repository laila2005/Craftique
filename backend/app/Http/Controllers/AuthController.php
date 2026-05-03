<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        // Check if Admin
        $admin = Admin::where('email', $request->email)->first();
        if ($admin && Hash::check($request->password, $admin->password)) {
            $token = $admin->createToken('admin-token', ['role:admin'])->plainTextToken;
            return response()->json([
                'token' => $token,
                'role' => 'admin',
                'user' => $admin
            ]);
        }

        // Check if normal User
        $user = User::where('email', $request->email)->first();
        if ($user && Hash::check($request->password, $user->password)) {
            $token = $user->createToken('buyer-token', ['role:buyer'])->plainTextToken;
            return response()->json([
                'token' => $token,
                'role' => 'buyer',
                'user' => $user
            ]);
        }

        throw ValidationException::withMessages([
            'email' => ['The provided credentials do not match our records.'],
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('buyer-token', ['role:buyer'])->plainTextToken;

        return response()->json([
            'token' => $token,
            'role' => 'buyer',
            'user' => $user
        ], 201);
    }
}
