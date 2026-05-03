<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Seller;
use App\Models\Admin;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Model::unguard();

        // Admin User
        Admin::create([
            'name' => 'Laila Admin',
            'email' => 'laila@craftique.com',
            'password' => Hash::make('medfylolo'),
        ]);

        // Standard User for checkout testing
        User::create([
            'name' => 'Test User',
            'email' => 'user@test.com',
            'password' => Hash::make('password'),
        ]);

        // 1. Create Admin
        Admin::create([
            'name' => 'Super Admin',
            'email' => 'admin@craftique.com',
            'password' => Hash::make('password'),
        ]);

        // 2. Create Sellers
        $seller1 = Seller::create([
            'name' => 'Alice Potter',
            'email' => 'alice@ceramicstudio.com',
            'password' => Hash::make('password'),
            'store_name' => 'Alice Ceramics',
            'description' => 'Handcrafted ceramics made with love in Brooklyn.'
        ]);

        $seller2 = Seller::create([
            'name' => 'Bob Weaver',
            'email' => 'bob@knits.com',
            'password' => Hash::make('password'),
            'store_name' => 'Cozy Knits',
            'description' => 'Warm, hand-knitted apparel and accessories.'
        ]);

        $seller3 = Seller::create([
            'name' => 'Chloe Soap',
            'email' => 'chloe@organics.com',
            'password' => Hash::make('password'),
            'store_name' => 'Earthly Organics',
            'description' => 'Natural, organic, and beautifully scented handmade soaps.'
        ]);

        $seller4 = Seller::create([
            'name' => 'Daniel Woodcraft',
            'email' => 'daniel@woodworks.com',
            'password' => Hash::make('password'),
            'store_name' => 'Oak & Grain',
            'description' => 'Custom woodworking and hand-carved home goods.'
        ]);

        $seller5 = Seller::create([
            'name' => 'Emma Jeweler',
            'email' => 'emma@gems.com',
            'password' => Hash::make('password'),
            'store_name' => 'Lumina Jewelry',
            'description' => 'Delicate, handcrafted silver and gemstone jewelry.'
        ]);

        // 3. Create Buyers
        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
        ]);

        // 4. Create Products
                                                                        $realProducts = [
            [
                'seller_id' => 1,
                'name' => 'Chunky Knit Blanket',
                'slug' => 'chunky-knit-blanket-0',
                'description' => 'A luxurious, oversized chunky knit blanket made from premium merino wool. Incredibly soft and warm.',
                'price' => 2500,
                'stock_quantity' => 17,
                'image_url' => '/images/products/craft_01.png'
            ],
            [
                'seller_id' => 2,
                'name' => 'Macrame Wall Hanging',
                'slug' => 'macrame-wall-hanging-1',
                'description' => 'Intricate bohemian macrame wall hanging. Hand-knotted with 100% natural cotton cord on a natural driftwood branch.',
                'price' => 850,
                'stock_quantity' => 19,
                'image_url' => '/images/products/craft_02.png'
            ],
            [
                'seller_id' => 3,
                'name' => 'Hand-Knitted Sweater',
                'slug' => 'hand-knitted-sweater-2',
                'description' => 'Cozy and stylish hand-knitted sweater. Made with a soft wool blend, featuring a classic cable knit pattern.',
                'price' => 1200,
                'stock_quantity' => 8,
                'image_url' => '/images/products/craft_03.png'
            ],
            [
                'seller_id' => 4,
                'name' => 'Crochet Amigurumi Toy Bear',
                'slug' => 'crochet-amigurumi-toy-bear-3',
                'description' => 'Adorable handmade crochet amigurumi bear. Crafted with baby-safe yarn and stuffed with hypoallergenic fill.',
                'price' => 450,
                'stock_quantity' => 7,
                'image_url' => '/images/products/craft_04.png'
            ],
            [
                'seller_id' => 5,
                'name' => 'Macrame Plant Hanger',
                'slug' => 'macrame-plant-hanger-4',
                'description' => 'Minimalist macrame plant hanger. Perfect for displaying your indoor plants and adding a touch of boho decor.',
                'price' => 350,
                'stock_quantity' => 17,
                'image_url' => '/images/products/craft_05.png'
            ],
            [
                'seller_id' => 1,
                'name' => 'Knitted Winter Beanie',
                'slug' => 'knitted-winter-beanie-5',
                'description' => 'Warm and fashionable knitted winter beanie hat. Features a soft fleece lining and a faux fur pom pom.',
                'price' => 300,
                'stock_quantity' => 2,
                'image_url' => '/images/products/craft_06.png'
            ],
            [
                'seller_id' => 2,
                'name' => 'Woven Yarn Tapestry',
                'slug' => 'woven-yarn-tapestry-6',
                'description' => 'Beautiful woven yarn tapestry featuring abstract landscape textures. A statement piece for any room.',
                'price' => 1100,
                'stock_quantity' => 2,
                'image_url' => '/images/products/craft_07.png'
            ],
            [
                'seller_id' => 3,
                'name' => 'Handmade Crochet Coasters',
                'slug' => 'handmade-crochet-coasters-7',
                'description' => 'Set of 4 elegant handmade crochet coasters. Protect your surfaces with these beautiful floral-patterned coasters.',
                'price' => 200,
                'stock_quantity' => 5,
                'image_url' => '/images/products/craft_08.png'
            ],
            [
                'seller_id' => 4,
                'name' => 'Knitted Baby Booties',
                'slug' => 'knitted-baby-booties-8',
                'description' => 'Sweet hand-knitted baby booties. Made from ultra-soft, organic cotton yarn to keep little feet warm.',
                'price' => 250,
                'stock_quantity' => 19,
                'image_url' => '/images/products/craft_09.png'
            ],
            [
                'seller_id' => 5,
                'name' => 'Macrame Dream Catcher',
                'slug' => 'macrame-dream-catcher-9',
                'description' => 'Ethereal macrame dream catcher with cascading fringe. Handwoven to bring peace and beauty to your bedroom.',
                'price' => 600,
                'stock_quantity' => 6,
                'image_url' => '/images/products/craft_10.png'
            ],
            [
                'seller_id' => 1,
                'name' => 'Handwoven Throw Pillow',
                'slug' => 'handwoven-throw-pillow-10',
                'description' => 'Textured handwoven throw pillow cover with tufted details. Adds a cozy, artisanal touch to your sofa.',
                'price' => 550,
                'stock_quantity' => 14,
                'image_url' => '/images/products/craft_11.png'
            ],
            [
                'seller_id' => 2,
                'name' => 'Crochet Tote Bag',
                'slug' => 'crochet-tote-bag-11',
                'description' => 'Sturdy and chic crochet tote bag. Ideal for farmers market trips or as a casual everyday accessory.',
                'price' => 750,
                'stock_quantity' => 20,
                'image_url' => '/images/products/craft_12.png'
            ],
            [
                'seller_id' => 3,
                'name' => 'Cozy Knitted Socks',
                'slug' => 'cozy-knitted-socks-12',
                'description' => 'Thick, warm hand-knitted socks. Perfect for lounging around the house on chilly evenings.',
                'price' => 300,
                'stock_quantity' => 11,
                'image_url' => '/images/products/craft_13.png'
            ],
            [
                'seller_id' => 4,
                'name' => 'Macrame Keychain',
                'slug' => 'macrame-keychain-13',
                'description' => 'Cute bohemian macrame keychain. Made with natural cotton cord and a sturdy brass clasp.',
                'price' => 150,
                'stock_quantity' => 4,
                'image_url' => '/images/products/craft_14.png'
            ],
            [
                'seller_id' => 5,
                'name' => 'Knitted Infinity Scarf',
                'slug' => 'knitted-infinity-scarf-14',
                'description' => 'Soft and voluminous knitted infinity scarf. An essential winter accessory crafted from a wool-alpaca blend.',
                'price' => 400,
                'stock_quantity' => 7,
                'image_url' => '/images/products/craft_15.png'
            ],
            [
                'seller_id' => 1,
                'name' => 'Woven Yarn Basket',
                'slug' => 'woven-yarn-basket-15',
                'description' => 'Versatile woven yarn basket. Great for storing crafting supplies, small toys, or bathroom essentials.',
                'price' => 500,
                'stock_quantity' => 2,
                'image_url' => '/images/products/craft_16.png'
            ],
            [
                'seller_id' => 2,
                'name' => 'Crochet Crop Top',
                'slug' => 'crochet-crop-top-16',
                'description' => 'Trendy handmade crochet crop top with a intricate lace pattern. Perfect for summer festivals.',
                'price' => 650,
                'stock_quantity' => 6,
                'image_url' => '/images/products/craft_17.png'
            ],
            [
                'seller_id' => 3,
                'name' => 'Macrame Table Runner',
                'slug' => 'macrame-table-runner-17',
                'description' => 'Stunning macrame table runner. Adds a sophisticated, rustic elegance to your dining table setting.',
                'price' => 900,
                'stock_quantity' => 21,
                'image_url' => '/images/products/craft_18.png'
            ],
            [
                'seller_id' => 4,
                'name' => 'Knitted Cardigan',
                'slug' => 'knitted-cardigan-18',
                'description' => 'Oversized hand-knitted cardigan with deep pockets and wooden buttons. Your new favorite layer.',
                'price' => 1400,
                'stock_quantity' => 7,
                'image_url' => '/images/products/craft_19.png'
            ],
            [
                'seller_id' => 5,
                'name' => 'Crochet Potholders',
                'slug' => 'crochet-potholders-19',
                'description' => 'Set of 2 thick, double-layered crochet potholders. Beautiful and highly functional kitchen essentials.',
                'price' => 180,
                'stock_quantity' => 4,
                'image_url' => '/images/products/craft_20.png'
            ],
            [
                'seller_id' => 1,
                'name' => 'Macrame Hammock Chair',
                'slug' => 'macrame-hammock-chair-20',
                'description' => 'Luxurious hanging macrame hammock chair. Create a relaxing reading nook anywhere in your home.',
                'price' => 3500,
                'stock_quantity' => 21,
                'image_url' => '/images/products/craft_21.png'
            ],
            [
                'seller_id' => 2,
                'name' => 'Knitted Tea Cozy',
                'slug' => 'knitted-tea-cozy-21',
                'description' => 'Charming hand-knitted tea cozy to keep your pot warm. Features lovely textured bobble stitches.',
                'price' => 220,
                'stock_quantity' => 6,
                'image_url' => '/images/products/craft_22.png'
            ],
            [
                'seller_id' => 3,
                'name' => 'Crochet Granny Square Blanket',
                'slug' => 'crochet-granny-square-blanket-22',
                'description' => 'Vibrant, retro-inspired crochet granny square blanket. A labor of love and a true heirloom piece.',
                'price' => 1800,
                'stock_quantity' => 8,
                'image_url' => '/images/products/craft_23.png'
            ],
            [
                'seller_id' => 4,
                'name' => 'Macrame Chandelier',
                'slug' => 'macrame-chandelier-23',
                'description' => 'Breathtaking macrame chandelier light shade. Casts beautiful, patterned shadows and creates a cozy ambiance.',
                'price' => 1600,
                'stock_quantity' => 20,
                'image_url' => '/images/products/craft_24.png'
            ],
        ];

        foreach ($realProducts as $product) {
            Product::create($product);
        }








    }
}
