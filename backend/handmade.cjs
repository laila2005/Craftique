const fs = require('fs');

const images = [
  'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop', // White Mug
  'https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=800&auto=format&fit=crop', // Wood Craft
  'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=800&auto=format&fit=crop', // Woodworking
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop', // Clay Vases
  'https://images.unsplash.com/photo-1544931170-3ca1337cce88?q=80&w=800&auto=format&fit=crop', // Scarf / Knit
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=800&auto=format&fit=crop', // Soap / Steamers
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop', // Jewelry
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop', // Room / Blanket
  'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800&auto=format&fit=crop', // Mug 2
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop', // Hoop / Ring
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop'  // Bath Bomb
];

const handmadeProducts = [
  { name: 'Speckled Ceramic Mug', desc: 'Hand-thrown speckled ceramic mug.', img: 0, price: 24.99 },
  { name: 'Minimalist Clay Vase', desc: 'Elegant unglazed clay vase.', img: 3, price: 45.00 },
  { name: 'Hand-Painted Serving Bowl', desc: 'Large ceramic serving bowl.', img: 3, price: 65.00 },
  { name: 'Matte Black Espresso Cups', desc: 'Set of two small ceramic espresso cups.', img: 8, price: 35.00 },
  { name: 'Terracotta Planter', desc: 'Classic handcrafted terracotta planter for indoor plants.', img: 3, price: 28.00 },
  { name: 'Glazed Matcha Bowl', desc: 'Traditional handmade matcha bowl with a beautiful green glaze.', img: 8, price: 42.00 },
  
  { name: 'Chunky Knit Wool Blanket', desc: 'Oversized chunky knit blanket made from merino wool.', img: 7, price: 120.00 },
  { name: 'Handwoven Alpaca Scarf', desc: 'Incredibly soft and lightweight alpaca wool scarf.', img: 4, price: 55.00 },
  { name: 'Cable Knit Throw Pillow', desc: 'Cozy ivory throw pillow cover.', img: 7, price: 42.00 },
  { name: 'Macrame Wall Hanging', desc: 'Intricate handmade macrame wall art made from natural cotton cord.', img: 4, price: 75.00 },
  { name: 'Knitted Beanie', desc: 'Warm and stylish winter beanie, hand-knitted with thick yarn.', img: 4, price: 25.00 },
  { name: 'Woven Cotton Rug', desc: 'Small artisan woven rug with colorful geometric patterns.', img: 7, price: 85.00 },

  { name: 'Lavender & Oatmeal Soap', desc: 'Soothing lavender essential oil paired with oatmeal.', img: 5, price: 8.50 },
  { name: 'Citrus Burst Bath Bomb', desc: 'Invigorating blend of orange, lemon, and grapefruit.', img: 10, price: 6.00 },
  { name: 'Rosewater Face Mist', desc: 'Refreshing and hydrating natural rosewater mist.', img: 5, price: 18.00 },
  { name: 'Eucalyptus Shower Steamers', desc: 'Handmade aromatherapy steamers.', img: 5, price: 15.00 },
  { name: 'Charcoal Detox Soap', desc: 'Activated charcoal and tea tree oil artisan soap bar.', img: 10, price: 9.00 },
  { name: 'Beeswax Lip Balm', desc: 'All-natural lip balm made with local beeswax and peppermint.', img: 10, price: 5.50 },

  { name: 'Hand-Carved Cutting Board', desc: 'Solid walnut edge-grain cutting board.', img: 1, price: 85.00 },
  { name: 'Rustic Olive Wood Coasters', desc: 'Set of 4 live-edge olive wood coasters.', img: 2, price: 32.00 },
  { name: 'Wooden Salad Tongs', desc: 'Hand-carved wooden salad servers made from cherry wood.', img: 1, price: 24.00 },
  { name: 'Oak Serving Tray', desc: 'Large sturdy oak serving tray with iron handles.', img: 2, price: 95.00 },
  { name: 'Carved Wooden Spoon', desc: 'Ergonomic cooking spoon, individually whittled.', img: 1, price: 18.00 },
  { name: 'Mahogany Bookends', desc: 'Set of two heavy mahogany bookends with a natural finish.', img: 2, price: 48.00 },

  { name: 'Sterling Moonstone Ring', desc: 'Delicate hammered sterling silver ring set with moonstone.', img: 6, price: 110.00 },
  { name: 'Gold-Plated Hoops', desc: 'Lightweight everyday hoop earrings, plated in 14k gold.', img: 9, price: 48.00 },
  { name: 'Turquoise Pendant Necklace', desc: 'Authentic turquoise stone set in handcrafted silver pendant.', img: 6, price: 85.00 },
  { name: 'Hammered Brass Cuff', desc: 'Adjustable brass bracelet with a textured hammered finish.', img: 9, price: 38.00 },
  { name: 'Rose Gold Stacking Rings', desc: 'Set of three thin rose gold rings meant to be worn together.', img: 6, price: 65.00 },
  { name: 'Beaded Drop Earrings', desc: 'Intricately hand-beaded earrings with glass seed beads.', img: 9, price: 34.00 }
];

let phpCode = '        $realProducts = [\n';
handmadeProducts.forEach((p, index) => {
  const sellerId = (index % 5) + 1;
  const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const imgUrl = images[p.img];
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
console.log('Seeder updated with 30 handmade products.');
