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

        // Calculate sales over the last 7 days
        $ordersLast7Days = Order::where('created_at', '>=', now()->subDays(6)->startOfDay())->get();
        $salesData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $salesData[$date] = 0;
        }

        foreach ($ordersLast7Days as $order) {
            $date = $order->created_at->format('Y-m-d');
            if (isset($salesData[$date])) {
                $salesData[$date] += $order->total_amount;
            }
        }

        $formattedSalesData = [];
        foreach ($salesData as $date => $total) {
            $formattedSalesData[] = [
                'date' => date('M d', strtotime($date)),
                'revenue' => $total
            ];
        }

        $orderStatusData = [
            ['name' => 'Pending', 'value' => Order::where('status', 'pending')->count()],
            ['name' => 'Processing', 'value' => Order::where('status', 'processing')->count()],
            ['name' => 'Shipped', 'value' => Order::where('status', 'shipped')->count()],
            ['name' => 'Delivered', 'value' => Order::where('status', 'delivered')->count()],
            ['name' => 'Cancelled', 'value' => Order::where('status', 'cancelled')->count()],
        ];

        return response()->json([
            'overview' => [
                'total_sales' => $totalSales,
                'total_orders' => $totalOrders,
                'total_products' => $totalProducts,
                'total_sellers' => $totalSellers,
            ],
            'recent_orders' => $recentOrders,
            'sales_data' => $formattedSalesData,
            'order_status_data' => $orderStatusData
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

    public function pendingProducts()
    {
        $products = Product::with('seller')->where('status', 'pending')->orderBy('created_at', 'desc')->get();
        return response()->json($products);
    }

    public function updateProductStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|string|in:approved,rejected'
        ]);

        $product = Product::findOrFail($id);
        $product->status = $request->status;
        $product->save();

        return response()->json([
            'message' => "Product {$request->status} successfully",
            'product' => $product
        ]);
    }
}
