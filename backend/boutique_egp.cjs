const https = require('https');
const fs = require('fs');

const agent = new https.Agent({
  rejectUnauthorized: false
});

https.get('https://dummyjson.com/products?limit=200', { agent }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const cats = ['furniture', 'home-decoration', 'womens-jewellery', 'sunglasses', 'womens-bags', 'mens-watches', 'womens-watches', 'tops', 'womens-dresses', 'mens-shirts', 'skin-care', 'fragrances'];
    let products = JSON.parse(data).products.filter(p => cats.includes(p.category));
    
    let phpCode = '        $realProducts = [\n';
    products.forEach((p, index) => {
      const sellerId = (index % 5) + 1;
      const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + index;
      const desc = p.description.replace(/'/g, "\\'");
      const title = p.title.replace(/'/g, "\\'");
      const img = p.images[0] || p.thumbnail;
      const imgEscaped = img.replace(/'/g, "\\'");
      
      const priceEGP = Math.round(p.price * 47.5); // Convert to EGP realistically
      
      phpCode += `            [
                'seller_id' => ${sellerId},
                'name' => 'Handcrafted ${title}',
                'slug' => '${slug}',
                'description' => 'Artisan made. ${desc}',
                'price' => ${priceEGP},
                'stock_quantity' => ${Math.floor(Math.random() * 50) + 5},
                'image_url' => '${imgEscaped}'
            ],\n`;
    });
    phpCode += '        ];\n\n        foreach ($realProducts as $product) {\n            Product::create($product);\n        }\n';
    
    const seeder = fs.readFileSync('database/seeders/DatabaseSeeder.php', 'utf8');
    const updated = seeder.replace(/\$realProducts = \[[\s\S]*?\];\n\n        foreach \(\$realProducts as \$product\) \{\n            Product::create\(\$product\);\n        \}/, phpCode);

    fs.writeFileSync('database/seeders/DatabaseSeeder.php', updated);
    console.log('Seeder updated with ' + products.length + ' boutique EGP products.');
  });
});
