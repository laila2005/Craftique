<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Product::with('seller')->get());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with(['seller', 'reviews.user'])->findOrFail($id);
        
        $similarProducts = Product::with('seller')
                            ->where('id', '!=', $id)
                            ->inRandomOrder()
                            ->take(4)
                            ->get();

        $canReview = false;
        $isFavorited = false;

        if (auth('sanctum')->check()) {
            $userId = auth('sanctum')->id();
            $isFavorited = \App\Models\Favorite::where('user_id', $userId)->where('product_id', $id)->exists();
            
            $hasPurchased = \App\Models\Order::where('user_id', $userId)
                ->whereHas('items', function ($query) use ($id) {
                    $query->where('product_id', $id);
                })->exists();
                
            $hasReviewed = $product->reviews()->where('user_id', $userId)->exists();
            
            $canReview = $hasPurchased && !$hasReviewed;
        }

        return response()->json([
            'product' => $product,
            'similar_products' => $similarProducts,
            'can_review' => $canReview,
            'is_favorited' => $isFavorited
        ]);
    }
}
