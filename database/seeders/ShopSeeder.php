<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        $owners = User::where('role', 'ShopOwner')->get();

        if ($owners->isEmpty()) {
            return;
        }

        $shops = [
            [
                'name' => 'City Groceries',
                'category' => 'Grocery',
                'description' => 'Fresh fruits and vegetables delivered daily.',
                'address' => 'Mall Road, Block A',
                'contact_phone' => '555-2020',
                'rating' => 4.4,
            ],
            [
                'name' => 'Electro Hub',
                'category' => 'Electronics',
                'description' => 'Gadgets and appliances at best prices.',
                'address' => 'Electronic Market, Shop #15',
                'contact_phone' => '555-3030',
                'rating' => 4.7,
            ],
            [
                'name' => 'Style Point',
                'category' => 'Fashion',
                'description' => 'Latest trends in men and women clothing.',
                'address' => 'Central Plaza, Floor 2',
                'contact_phone' => '555-4040',
                'rating' => 4.1,
            ],
        ];

        foreach ($shops as $index => $shopData) {
            $owner = $owners[$index % $owners->count()];
            $shop = Shop::create(array_merge($shopData, ['owner_id' => $owner->id]));

            // Create some products for each shop
            if ($shopData['category'] === 'Grocery') {
                Product::create(['shop_id' => $shop->id, 'name' => 'Organic Apples', 'price' => 120.00, 'description' => 'Bag of 6 apples']);
                Product::create(['shop_id' => $shop->id, 'name' => 'Fresh Milk', 'price' => 45.00, 'description' => '1 Liter']);
            } elseif ($shopData['category'] === 'Electronics') {
                Product::create(['shop_id' => $shop->id, 'name' => 'Wireless Mouse', 'price' => 899.00, 'description' => 'Ergonomic design']);
                Product::create(['shop_id' => $shop->id, 'name' => 'USB-C Cable', 'price' => 299.00, 'description' => 'High speed charging']);
            }
        }
    }
}
