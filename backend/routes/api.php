<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::post('/seller/register', [\App\Http\Controllers\SellerAuthController::class, 'register']);
Route::post('/seller/login', [\App\Http\Controllers\SellerAuthController::class, 'login']);

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
    Route::post('admin/products', [ProductController::class, 'store']);
    Route::delete('admin/products/{product}', [ProductController::class, 'destroy']);
    Route::get('admin/products/pending', [AdminController::class, 'pendingProducts']);
    Route::put('admin/products/{id}/status', [AdminController::class, 'updateProductStatus']);

    Route::post('products/{product}/reviews', [\App\Http\Controllers\ReviewController::class, 'store']);
    Route::post('products/{product}/favorite', [\App\Http\Controllers\FavoriteController::class, 'toggle']);
    Route::post('promo-codes/validate', [\App\Http\Controllers\PromoCodeController::class, 'validateCode']);
    
    // Seller Protected Routes
    Route::get('seller/products', [\App\Http\Controllers\SellerProductController::class, 'index']);
    Route::post('seller/products', [\App\Http\Controllers\SellerProductController::class, 'store']);
    Route::get('seller/products/{id}', [\App\Http\Controllers\SellerProductController::class, 'show']);
    Route::put('seller/products/{id}', [\App\Http\Controllers\SellerProductController::class, 'update']);
    Route::delete('seller/products/{id}', [\App\Http\Controllers\SellerProductController::class, 'destroy']);
});

Route::apiResource('products', ProductController::class)->only(['index', 'show']);
