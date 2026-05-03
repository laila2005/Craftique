<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$favorites = \App\Models\Favorite::all();
echo "Favorites count: " . $favorites->count() . "\n";
foreach ($favorites as $f) {
    echo "User: " . $f->user_id . ", Product: " . $f->product_id . "\n";
}
