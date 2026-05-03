const fs = require('fs');

const crafts = [
  { name: 'Chunky Knit Blanket', price: 2500, desc: 'A luxurious, oversized chunky knit blanket made from premium merino wool. Incredibly soft and warm.' },
  { name: 'Macrame Wall Hanging', price: 850, desc: 'Intricate bohemian macrame wall hanging. Hand-knotted with 100% natural cotton cord on a natural driftwood branch.' },
  { name: 'Hand-Knitted Sweater', price: 1200, desc: 'Cozy and stylish hand-knitted sweater. Made with a soft wool blend, featuring a classic cable knit pattern.' },
  { name: 'Crochet Amigurumi Toy Bear', price: 450, desc: 'Adorable handmade crochet amigurumi bear. Crafted with baby-safe yarn and stuffed with hypoallergenic fill.' },
  { name: 'Macrame Plant Hanger', price: 350, desc: 'Minimalist macrame plant hanger. Perfect for displaying your indoor plants and adding a touch of boho decor.' },
  { name: 'Knitted Winter Beanie', price: 300, desc: 'Warm and fashionable knitted winter beanie hat. Features a soft fleece lining and a faux fur pom pom.' },
  { name: 'Woven Yarn Tapestry', price: 1100, desc: 'Beautiful woven yarn tapestry featuring abstract landscape textures. A statement piece for any room.' },
  { name: 'Handmade Crochet Coasters', price: 200, desc: 'Set of 4 elegant handmade crochet coasters. Protect your surfaces with these beautiful floral-patterned coasters.' },
  { name: 'Knitted Baby Booties', price: 250, desc: 'Sweet hand-knitted baby booties. Made from ultra-soft, organic cotton yarn to keep little feet warm.' },
  { name: 'Macrame Dream Catcher', price: 600, desc: 'Ethereal macrame dream catcher with cascading fringe. Handwoven to bring peace and beauty to your bedroom.' },
  { name: 'Handwoven Throw Pillow', price: 550, desc: 'Textured handwoven throw pillow cover with tufted details. Adds a cozy, artisanal touch to your sofa.' },
  { name: 'Crochet Tote Bag', price: 750, desc: 'Sturdy and chic crochet tote bag. Ideal for farmers market trips or as a casual everyday accessory.' },
  { name: 'Cozy Knitted Socks', price: 300, desc: 'Thick, warm hand-knitted socks. Perfect for lounging around the house on chilly evenings.' },
  { name: 'Macrame Keychain', price: 150, desc: 'Cute bohemian macrame keychain. Made with natural cotton cord and a sturdy brass clasp.' },
  { name: 'Knitted Infinity Scarf', price: 400, desc: 'Soft and voluminous knitted infinity scarf. An essential winter accessory crafted from a wool-alpaca blend.' },
  { name: 'Woven Yarn Basket', price: 500, desc: 'Versatile woven yarn basket. Great for storing crafting supplies, small toys, or bathroom essentials.' },
  { name: 'Crochet Crop Top', price: 650, desc: 'Trendy handmade crochet crop top with a intricate lace pattern. Perfect for summer festivals.' },
  { name: 'Macrame Table Runner', price: 900, desc: 'Stunning macrame table runner. Adds a sophisticated, rustic elegance to your dining table setting.' },
  { name: 'Knitted Cardigan', price: 1400, desc: 'Oversized hand-knitted cardigan with deep pockets and wooden buttons. Your new favorite layer.' },
  { name: 'Crochet Potholders', price: 180, desc: 'Set of 2 thick, double-layered crochet potholders. Beautiful and highly functional kitchen essentials.' },
  { name: 'Macrame Hammock Chair', price: 3500, desc: 'Luxurious hanging macrame hammock chair. Create a relaxing reading nook anywhere in your home.' },
  { name: 'Knitted Tea Cozy', price: 220, desc: 'Charming hand-knitted tea cozy to keep your pot warm. Features lovely textured bobble stitches.' },
  { name: 'Crochet Granny Square Blanket', price: 1800, desc: 'Vibrant, retro-inspired crochet granny square blanket. A labor of love and a true heirloom piece.' },
  { name: 'Macrame Chandelier', price: 1600, desc: 'Breathtaking macrame chandelier light shade. Casts beautiful, patterned shadows and creates a cozy ambiance.' }
];

let phpCode = '        $realProducts = [\n';
crafts.forEach((c, index) => {
  const sellerId = (index % 5) + 1;
  const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + index;
  const desc = c.desc.replace(/'/g, "\\'");
  const title = c.name.replace(/'/g, "\\'");
  const imageNum = (index + 1).toString().padStart(2, '0');
  const imgUrl = `http://localhost:5173/images/products/craft_${imageNum}.png`;
  
  phpCode += `            [
                'seller_id' => ${sellerId},
                'name' => '${title}',
                'slug' => '${slug}',
                'description' => '${desc}',
                'price' => ${c.price},
                'stock_quantity' => ${Math.floor(Math.random() * 20) + 2},
                'image_url' => '${imgUrl}'
            ],\n`;
});
phpCode += '        ];\n\n        foreach ($realProducts as $product) {\n            Product::create($product);\n        }\n';

const seeder = fs.readFileSync('database/seeders/DatabaseSeeder.php', 'utf8');
const updated = seeder.replace(/\$realProducts = \[[\s\S]*?\];\n\n        foreach \(\$realProducts as \$product\) \{\n            Product::create\(\$product\);\n        \}/, phpCode);

fs.writeFileSync('database/seeders/DatabaseSeeder.php', updated);
console.log('Seeder updated with 24 truly handcrafted products.');
