<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
            'email' => 'required|email',
            'name' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            $totalAmount = 0;
            $orderItemsData = [];

            // Calculate total and prepare items
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['id']);
                $quantity = $item['quantity'];
                
                if ($product->stock_quantity < $quantity) {
                    return response()->json(['message' => "Not enough stock for {$product->name}"], 400);
                }

                $totalAmount += $product->price * $quantity;
                
                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'seller_id' => $product->seller_id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                ];

                // Decrement stock
                $product->decrement('stock_quantity', $quantity);
            }

            // Create Order
            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'shipping_address' => $request->shipping_address . "\n" . $request->name . "\n" . $request->email,
            ]);

            // Create Order Items
            foreach ($orderItemsData as $data) {
                $order->items()->create($data);
            }

            DB::commit();

            return response()->json(['message' => 'Order placed successfully', 'order_id' => $order->id], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Checkout Error: ' . $e->getMessage() . ' at ' . $e->getFile() . ':' . $e->getLine());
            return response()->json(['message' => 'Failed to place order: ' . $e->getMessage(), 'error' => $e->getMessage()], 500);
        }
    }
}
