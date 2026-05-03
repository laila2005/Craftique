<?php

$modelsDir = __DIR__ . '/backend/app/Models/';

function updateModel($file, $fillable, $hidden = '') {
    global $modelsDir;
    $filePath = $modelsDir . $file . '.php';
    if (!file_exists($filePath)) return;
    
    $content = file_get_contents($filePath);
    
    $fillableStr = "    protected \$fillable = [\n        " . implode(",\n        ", array_map(function($i) { return "'$i'"; }, $fillable)) . "\n    ];\n";
    
    if ($hidden) {
        $fillableStr .= "\n    protected \$hidden = [\n        " . implode(",\n        ", array_map(function($i) { return "'$i'"; }, $hidden)) . "\n    ];\n";
    }
    
    // insert inside class
    $pattern = '/use HasFactory;\n/s';
    $content = preg_replace($pattern, "use HasFactory;\n\n" . $fillableStr, $content);
    
    file_put_contents($filePath, $content);
}

// 1. Sellers
updateModel('Seller', ['name', 'email', 'password', 'store_name', 'description'], ['password', 'remember_token']);
// 2. Admins
updateModel('Admin', ['name', 'email', 'password'], ['password', 'remember_token']);
// 3. Products
updateModel('Product', ['seller_id', 'name', 'slug', 'description', 'price', 'stock_quantity', 'image_url', 'is_archived']);
// 4. Orders
updateModel('Order', ['user_id', 'total_amount', 'status', 'shipping_address']);
// 5. OrderItems
updateModel('OrderItem', ['order_id', 'product_id', 'seller_id', 'quantity', 'price']);
// 6. Carts
updateModel('Cart', ['user_id']);
// 7. CartItems
updateModel('CartItem', ['cart_id', 'product_id', 'quantity']);
// 8. Reviews
updateModel('Review', ['product_id', 'user_id', 'rating', 'comment']);

// Update relations (Products belongsTo Seller) etc.
// For now, fillable is enough for the seeder to work.

echo "Models updated successfully!\n";
