<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;

Route::prefix('v1')->group(function () {
    
    // Public Routes
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/seller/register', [\App\Http\Controllers\SellerAuthController::class, 'register']);
    Route::post('/seller/login', [\App\Http\Controllers\SellerAuthController::class, 'login']);
    
    Route::apiResource('products', ProductController::class)->only(['index', 'show']);

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        
        // General Auth Routes
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
        Route::get('user/profile', [\App\Http\Controllers\UserController::class, 'profile']);
        
        // Buyer Routes
        Route::middleware('ability:role:buyer')->group(function () {
            Route::post('checkout', [CheckoutController::class, 'store']);
            Route::post('products/{product}/reviews', [\App\Http\Controllers\ReviewController::class, 'store']);
            Route::post('products/{product}/favorite', [\App\Http\Controllers\FavoriteController::class, 'toggle']);
            Route::post('promo-codes/validate', [\App\Http\Controllers\PromoCodeController::class, 'validateCode']);
        });

        // Admin Routes
        Route::middleware('ability:role:admin')->prefix('admin')->group(function () {
            Route::get('stats', [AdminController::class, 'stats']);
            Route::get('orders', [AdminController::class, 'orders']);
            Route::put('orders/{order}/status', [AdminController::class, 'updateOrderStatus']);
            Route::post('products', [ProductController::class, 'store']);
            Route::delete('products/{product}', [ProductController::class, 'destroy']);
            Route::get('products/pending', [AdminController::class, 'pendingProducts']);
            Route::put('products/{id}/status', [AdminController::class, 'updateProductStatus']);
        });

        // Seller Routes
        Route::middleware('ability:role:seller')->prefix('seller')->group(function () {
            Route::get('products', [\App\Http\Controllers\SellerProductController::class, 'index']);
            Route::post('products', [\App\Http\Controllers\SellerProductController::class, 'store']);
            Route::get('products/{id}', [\App\Http\Controllers\SellerProductController::class, 'show']);
            Route::put('products/{id}', [\App\Http\Controllers\SellerProductController::class, 'update']);
            Route::delete('products/{id}', [\App\Http\Controllers\SellerProductController::class, 'destroy']);
        });
    });
});
