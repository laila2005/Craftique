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
        $products = \App\Models\Product::with('seller')->where('status', 'approved')->orderBy('created_at', 'desc')->get();
        return \App\Http\Resources\ProductResource::collection($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'image_url' => 'nullable|url',
            'image_file' => 'nullable|image|max:2048',
        ]);

        $imageUrl = $request->image_url;

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('products', 'public');
            $imageUrl = url('storage/' . $path);
        }

        if (!$imageUrl) {
            $imageUrl = 'https://images.unsplash.com/photo-1610444317765-b463fb721029?q=80&w=2000&auto=format&fit=crop';
        }

        $product = \App\Models\Product::create([
            'name' => $request->name,
            'slug' => \Illuminate\Support\Str::slug($request->name) . '-' . uniqid(),
            'description' => $request->description,
            'price' => $request->price,
            'stock_quantity' => $request->stock_quantity,
            'image_url' => $imageUrl,
            'seller_id' => 1, // Assign to default seller for admin
            'is_archived' => false
        ]);

        return response()->json([
            'message' => 'Product created successfully', 
            'product' => new \App\Http\Resources\ProductResource($product)
        ], 201);
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
            'product' => new \App\Http\Resources\ProductResource($product),
            'similar_products' => \App\Http\Resources\ProductResource::collection($similarProducts),
            'can_review' => $canReview,
            'is_favorited' => $isFavorited
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }
}
