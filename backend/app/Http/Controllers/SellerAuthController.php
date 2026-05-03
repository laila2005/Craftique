<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Seller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class SellerAuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:sellers',
            'password' => 'required|string|min:8',
            'store_name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $seller = Seller::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'store_name' => $request->store_name,
            'description' => $request->description ?? '',
        ]);

        $token = $seller->createToken('seller-auth-token')->plainTextToken;

        return response()->json([
            'seller' => $seller,
            'token' => $token,
            'role' => 'seller'
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        $seller = Seller::where('email', $request->email)->first();

        if (!$seller || !Hash::check($request->password, $seller->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $seller->createToken('seller-auth-token')->plainTextToken;

        return response()->json([
            'seller' => $seller,
            'token' => $token,
            'role' => 'seller'
        ], 200);
    }
}
