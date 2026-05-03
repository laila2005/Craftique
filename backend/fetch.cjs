const https = require('https');
const fs = require('fs');

const agent = new https.Agent({
  rejectUnauthorized: false
});

https.get('https://dummyjson.com/products?limit=50', { agent }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const products = JSON.parse(data).products;
    
    let phpCode = '        $realProducts = [\n';
    products.forEach((p, index) => {
      const sellerId = (index % 5) + 1;
      const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const desc = p.description.replace(/'/g, "\\'");
      const title = p.title.replace(/'/g, "\\'");
      const img = p.images[0] || p.thumbnail;
      
      phpCode += `            [
                'seller_id' => ${sellerId},
                'name' => '${title}',
                'slug' => '${slug}',
                'description' => '${desc}',
                'price' => ${p.price},
                'stock_quantity' => ${p.stock},
                'image_url' => '${img}'
            ],\n`;
    });
    phpCode += '        ];\n\n        foreach ($realProducts as $product) {\n            Product::create($product);\n        }\n';
    
    fs.writeFileSync('temp_products.php', phpCode);
    console.log('Wrote 50 products to temp_products.php');
  });
});
