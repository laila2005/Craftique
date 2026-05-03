<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PromoCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\PromoCode::create([
            'code' => 'SAVE10',
            'discount_percentage' => 10,
            'is_active' => true,
        ]);

        \App\Models\PromoCode::create([
            'code' => 'CRAFT20',
            'discount_percentage' => 20,
            'is_active' => true,
        ]);
        
        \App\Models\PromoCode::create([
            'code' => 'WELCOME50',
            'discount_percentage' => 50,
            'is_active' => true,
        ]);
    }
}
