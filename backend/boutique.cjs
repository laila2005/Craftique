const https = require('https');
const fs = require('fs');

const agent = new https.Agent({
  rejectUnauthorized: false
});

https.get('https://dummyjson.com/products?limit=200', { agent }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const cats = ['furniture', 'home-decoration', 'womens-jewellery', 'sunglasses', 'womens-bags'];
    let products = JSON.parse(data).products.filter(p => cats.includes(p.category));
    
    // Shuffle and pick 30
    products = products.sort(() => 0.5 - Math.random()).slice(0, 30);
    
    let phpCode = '        $realProducts = [\n';
    products.forEach((p, index) => {
      const sellerId = (index % 5) + 1;
      const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const desc = p.description.replace(/'/g, "\\'");
      const title = p.title.replace(/'/g, "\\'");
      const img = p.images[0] || p.thumbnail;
      
      phpCode += `            [
                'seller_id' => ${sellerId},
                'name' => 'Handcrafted ${title}',
                'slug' => '${slug}',
                'description' => 'Artisan made. ${desc}',
                'price' => ${p.price},
                'stock_quantity' => ${Math.floor(Math.random() * 50) + 5},
                'image_url' => '${img}'
            ],\n`;
    });
    phpCode += '        ];\n\n        foreach ($realProducts as $product) {\n            Product::create($product);\n        }\n';
    
    const seeder = fs.readFileSync('database/seeders/DatabaseSeeder.php', 'utf8');
    const updated = seeder.replace(/\$realProducts = \[[\s\S]*?\];\n\n        foreach \(\$realProducts as \$product\) \{\n            Product::create\(\$product\);\n        \}/, phpCode);

    fs.writeFileSync('database/seeders/DatabaseSeeder.php', updated);
    console.log('Seeder updated with 30 boutique products.');
  });
});
