<?php

$migrationsDir = __DIR__ . '/backend/database/migrations/';

function updateMigration($file, $schema) {
    global $migrationsDir;
    $files = glob($migrationsDir . '*' . $file . '.php');
    if (empty($files)) return;
    $filePath = $files[0];
    $content = file_get_contents($filePath);
    
    // find public function up(): void { Schema::create('table', function (Blueprint $table) {
    $pattern = '/Schema::create\(\'[^\']+\',\s*function\s*\(Blueprint\s*\$table\)\s*\{[^\}]+\}\);/s';
    
    $replacement = "Schema::create('" . explode('_', $file)[1] . "', function (Blueprint \$table) {\n" . $schema . "\n        });";
    
    // specific case for users which is a default migration
    if ($file === 'create_users_table') {
        // we'll leave it as is mostly but just let's see. Actually I'll use multi_replace for users if needed.
    } else {
        $content = preg_replace($pattern, $replacement, $content);
        file_put_contents($filePath, $content);
    }
}

// 1. Sellers
updateMigration('create_sellers_table', "
            \$table->id();
            \$table->string('name');
            \$table->string('email')->unique();
            \$table->string('password');
            \$table->string('store_name')->nullable();
            \$table->text('description')->nullable();
            \$table->rememberToken();
            \$table->timestamps();
");

// 2. Admins
updateMigration('create_admins_table', "
            \$table->id();
            \$table->string('name');
            \$table->string('email')->unique();
            \$table->string('password');
            \$table->rememberToken();
            \$table->timestamps();
");

// 3. Products
updateMigration('create_products_table', "
            \$table->id();
            \$table->foreignId('seller_id')->constrained('sellers')->cascadeOnDelete();
            \$table->string('name');
            \$table->string('slug')->unique();
            \$table->text('description');
            \$table->decimal('price', 10, 2);
            \$table->integer('stock_quantity')->default(0);
            \$table->string('image_url')->nullable();
            \$table->boolean('is_archived')->default(false);
            \$table->softDeletes();
            \$table->timestamps();
");

// 4. Orders
updateMigration('create_orders_table', "
            \$table->id();
            \$table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            \$table->decimal('total_amount', 10, 2);
            \$table->string('status')->default('pending'); // pending, paid, shipped, completed, cancelled
            \$table->text('shipping_address');
            \$table->timestamps();
");

// 5. OrderItems
updateMigration('create_order_items_table', "
            \$table->id();
            \$table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            \$table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            \$table->foreignId('seller_id')->constrained('sellers')->cascadeOnDelete();
            \$table->integer('quantity');
            \$table->decimal('price', 10, 2); // price at time of order
            \$table->timestamps();
");

// 6. Carts
updateMigration('create_carts_table', "
            \$table->id();
            \$table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            \$table->timestamps();
");

// 7. CartItems
updateMigration('create_cart_items_table', "
            \$table->id();
            \$table->foreignId('cart_id')->constrained('carts')->cascadeOnDelete();
            \$table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            \$table->integer('quantity')->default(1);
            \$table->timestamps();
");

// 8. Reviews
updateMigration('create_reviews_table', "
            \$table->id();
            \$table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            \$table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            \$table->integer('rating'); // 1-5
            \$table->text('comment')->nullable();
            \$table->timestamps();
");

echo "Migrations updated successfully!\n";
