const fs = require('fs');
const seeder = fs.readFileSync('database/seeders/DatabaseSeeder.php', 'utf8');
const tempProducts = fs.readFileSync('temp_products.php', 'utf8');

const updated = seeder.replace(/\$products = \[[\s\S]*?\];\n\n        foreach \(\$products as \$product\) \{\n            Product::create\(\$product\);\n        \}/, tempProducts);

fs.writeFileSync('database/seeders/DatabaseSeeder.php', updated);
console.log("Replaced successfully");
