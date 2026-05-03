<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Favorite;

class UserController extends Controller
{
    public function profile()
    {
        $userId = auth()->id();
        
        $orders = Order::with('items.product')->where('user_id', $userId)->orderBy('created_at', 'desc')->get();
        $favorites = Favorite::with('product')->where('user_id', $userId)->get();

        return response()->json([
            'user' => auth()->user(),
            'orders' => $orders,
            'favorites' => $favorites
        ]);
    }
}
