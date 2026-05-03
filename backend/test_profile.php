<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    $orders = \App\Models\Order::with('items.product')->where('user_id', 1)->orderBy('created_at', 'desc')->get();
    echo "Orders success\n";
} catch (\Exception $e) {
    echo "Orders error: " . $e->getMessage() . "\n";
}

try {
    $favorites = \App\Models\Favorite::with('product')->where('user_id', 1)->get();
    echo "Favorites success\n";
} catch (\Exception $e) {
    echo "Favorites error: " . $e->getMessage() . "\n";
}
