const fs = require('fs');

const handmadeProducts = [
  { name: 'Speckled Ceramic Mug', desc: 'Hand-thrown speckled ceramic mug with a beautiful glaze.', price: 24.99 },
  { name: 'Minimalist Clay Vase', desc: 'Elegant unglazed clay vase perfect for dried flowers.', price: 45.00 },
  { name: 'Hand-Painted Serving Bowl', desc: 'Large ceramic serving bowl featuring a geometric design.', price: 65.00 },
  { name: 'Matte Black Espresso Cups', desc: 'Set of two small ceramic espresso cups.', price: 35.00 },
  { name: 'Terracotta Planter', desc: 'Classic handcrafted terracotta planter for indoor plants.', price: 28.00 },
  { name: 'Glazed Matcha Bowl', desc: 'Traditional handmade matcha bowl with a vibrant green glaze.', price: 42.00 },
  
  { name: 'Chunky Knit Wool Blanket', desc: 'Oversized chunky knit blanket made from 100% merino wool.', price: 120.00 },
  { name: 'Handwoven Alpaca Scarf', desc: 'Incredibly soft and lightweight alpaca wool scarf.', price: 55.00 },
  { name: 'Cable Knit Throw Pillow', desc: 'Cozy ivory throw pillow cover with intricate knitting.', price: 42.00 },
  { name: 'Macrame Wall Hanging', desc: 'Handmade macrame wall art made from natural cotton cord.', price: 75.00 },
  { name: 'Knitted Winter Beanie', desc: 'Warm and stylish winter beanie, hand-knitted with thick yarn.', price: 25.00 },
  { name: 'Woven Cotton Rug', desc: 'Small artisan woven rug with colorful geometric patterns.', price: 85.00 },

  { name: 'Lavender Oatmeal Soap', desc: 'Soothing lavender essential oil paired with exfoliating oatmeal.', price: 8.50 },
  { name: 'Citrus Burst Bath Bomb', desc: 'Invigorating blend of orange, lemon, and grapefruit essential oils.', price: 6.00 },
  { name: 'Rosewater Face Mist', desc: 'Refreshing and hydrating natural rosewater mist.', price: 18.00 },
  { name: 'Eucalyptus Shower Steamers', desc: 'Handmade aromatherapy shower steamers for relaxation.', price: 15.00 },
  { name: 'Charcoal Detox Soap', desc: 'Activated charcoal and tea tree oil artisan soap bar.', price: 9.00 },
  { name: 'Beeswax Lip Balm', desc: 'All-natural lip balm made with local beeswax and peppermint.', price: 5.50 },

  { name: 'Hand-Carved Cutting Board', desc: 'Solid walnut edge-grain cutting board, finished with beeswax.', price: 85.00 },
  { name: 'Rustic Olive Wood Coasters', desc: 'Set of 4 live-edge olive wood coasters. Each piece is unique.', price: 32.00 },
  { name: 'Wooden Salad Tongs', desc: 'Hand-carved wooden salad servers made from sustainable cherry wood.', price: 24.00 },
  { name: 'Oak Serving Tray', desc: 'Large sturdy oak serving tray with rustic iron handles.', price: 95.00 },
  { name: 'Carved Wooden Spoon', desc: 'Ergonomic cooking spoon, individually whittled from maple.', price: 18.00 },
  { name: 'Mahogany Bookends', desc: 'Set of two heavy mahogany bookends with a natural finish.', price: 48.00 },

  { name: 'Sterling Moonstone Ring', desc: 'Delicate hammered sterling silver ring set with a raw moonstone.', price: 110.00 },
  { name: 'Gold-Plated Minimalist Hoops', desc: 'Lightweight everyday hoop earrings, hand-formed and plated in 14k gold.', price: 48.00 },
  { name: 'Turquoise Pendant Necklace', desc: 'Authentic turquoise stone set in a handcrafted silver pendant.', price: 85.00 },
  { name: 'Hammered Brass Cuff', desc: 'Adjustable brass bracelet with a textured hammered finish.', price: 38.00 },
  { name: 'Rose Gold Stacking Rings', desc: 'Set of three thin rose gold rings meant to be worn together.', price: 65.00 },
  { name: 'Beaded Drop Earrings', desc: 'Intricately hand-beaded earrings with colorful glass seed beads.', price: 34.00 }
];

let phpCode = '        $realProducts = [\n';
handmadeProducts.forEach((p, index) => {
  const sellerId = (index % 5) + 1;
  const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const imgUrl = `https://loremflickr.com/800/800/craft,handmade?lock=${index + 1}`;
  
  phpCode += `            [
                'seller_id' => ${sellerId},
                'name' => '${p.name.replace(/'/g, "\\'")}',
                'slug' => '${slug}',
                'description' => '${p.desc.replace(/'/g, "\\'")}',
                'price' => ${p.price},
                'stock_quantity' => ${Math.floor(Math.random() * 50) + 5},
                'image_url' => '${imgUrl}'
            ],\n`;
});
phpCode += '        ];\n\n        foreach ($realProducts as $product) {\n            Product::create($product);\n        }\n';

const seeder = fs.readFileSync('database/seeders/DatabaseSeeder.php', 'utf8');
const updated = seeder.replace(/\$realProducts = \[[\s\S]*?\];\n\n        foreach \(\$realProducts as \$product\) \{\n            Product::create\(\$product\);\n        \}/, phpCode);

fs.writeFileSync('database/seeders/DatabaseSeeder.php', updated);
console.log('Seeder updated with 30 UNIQUE handmade products via LoremFlickr.');
