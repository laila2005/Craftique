<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('user/profile', [\App\Http\Controllers\UserController::class, 'profile']);
    Route::post('checkout', [CheckoutController::class, 'store']);
    
    // Admin Routes
    Route::get('admin/stats', [AdminController::class, 'stats']);
    Route::get('admin/orders', [AdminController::class, 'orders']);
    Route::put('admin/orders/{order}/status', [AdminController::class, 'updateOrderStatus']);

    Route::post('products/{product}/reviews', [\App\Http\Controllers\ReviewController::class, 'store']);
    Route::post('products/{product}/favorite', [\App\Http\Controllers\FavoriteController::class, 'toggle']);
});

Route::apiResource('products', ProductController::class)->only(['index', 'show']);
