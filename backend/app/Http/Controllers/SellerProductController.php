<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Gate;

class SellerProductController extends Controller
{
    public function index(Request $request)
    {
        $seller = $request->user(); 
        
        if (!($seller instanceof \App\Models\Seller)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $products = $seller->products()->orderBy('created_at', 'desc')->get();
        return \App\Http\Resources\ProductResource::collection($products);
    }

    public function store(Request $request)
    {
        $seller = $request->user();
        if (!($seller instanceof \App\Models\Seller)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

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

        $product = Product::create([
            'name' => $request->name,
            'slug' => \Illuminate\Support\Str::slug($request->name) . '-' . uniqid(),
            'description' => $request->description,
            'price' => $request->price,
            'stock_quantity' => $request->stock_quantity,
            'image_url' => $imageUrl,
            'seller_id' => $seller->id,
            'status' => 'pending',
            'is_archived' => false
        ]);

        return response()->json([
            'message' => 'Product submitted for approval', 
            'product' => new \App\Http\Resources\ProductResource($product)
        ], 201);
    }

    public function show(Request $request, string $id)
    {
        $seller = $request->user();
        $product = Product::with(['reviews.user'])->findOrFail($id);

        Gate::forUser($seller)->authorize('update', $product);

        return new \App\Http\Resources\ProductResource($product);
    }

    public function update(Request $request, string $id)
    {
        $seller = $request->user();
        $product = Product::findOrFail($id);

        Gate::forUser($seller)->authorize('update', $product);

        $request->validate([
            'stock_quantity' => 'required|integer|min:0',
        ]);

        $product->stock_quantity = $request->stock_quantity;
        $product->save();

        return response()->json([
            'message' => 'Stock updated successfully', 
            'product' => new \App\Http\Resources\ProductResource($product)
        ]);
    }
// soft delete
    public function destroy(Request $request, string $id)
    {
        $seller = $request->user();
        $product = Product::findOrFail($id);

        Gate::forUser($seller)->authorize('delete', $product);

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
