<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Favorite;

class FavoriteController extends Controller
{
    public function toggle(Product $product)
    {
        $userId = auth()->id();
        $favorite = Favorite::where('user_id', $userId)->where('product_id', $product->id)->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json(['message' => 'Removed from favorites', 'is_favorited' => false]);
        } else {
            Favorite::create([
                'user_id' => $userId,
                'product_id' => $product->id
            ]);
            return response()->json(['message' => 'Added to favorites', 'is_favorited' => true]);
        }
    }
}
