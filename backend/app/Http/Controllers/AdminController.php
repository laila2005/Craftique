<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Seller;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        $totalSales = Order::sum('total_amount');
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $totalSellers = Seller::count();

        $recentOrders = Order::with('items.product')->orderBy('created_at', 'desc')->take(5)->get();

        return response()->json([
            'overview' => [
                'total_sales' => $totalSales,
                'total_orders' => $totalOrders,
                'total_products' => $totalProducts,
                'total_sellers' => $totalSellers,
            ],
            'recent_orders' => $recentOrders
        ]);
    }

    public function orders()
    {
        $orders = Order::with('items.product', 'items.seller')->orderBy('created_at', 'desc')->paginate(20);
        return response()->json($orders);
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled'
        ]);

        $order->status = $request->status;
        $order->save();

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order
        ]);
    }
}
