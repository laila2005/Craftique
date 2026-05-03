<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order;
use App\Models\Review;

class ReviewController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $userId = auth()->id();

        // Verify purchase
        $hasPurchased = Order::where('user_id', $userId)
            ->whereHas('items', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })->exists();

        if (!$hasPurchased) {
            return response()->json(['message' => 'You must purchase this item before leaving a review.'], 403);
        }

        // Check if already reviewed
        if (Review::where('user_id', $userId)->where('product_id', $product->id)->exists()) {
            return response()->json(['message' => 'You have already reviewed this product.'], 400);
        }

        $review = $product->reviews()->create([
            'user_id' => $userId,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json(['message' => 'Review added successfully', 'review' => $review], 201);
    }
}
