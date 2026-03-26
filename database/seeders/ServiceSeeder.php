<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $providers = User::where('role', 'Provider')->get();

        if ($providers->isEmpty()) {
            return;
        }

        $services = [
            ['name' => 'Expert Plumbing', 'category' => 'Plumbing', 'area' => 'City Wide', 'contact_phone' => '555-5050', 'rating' => 4.6],
            ['name' => 'Quick Electrician', 'category' => 'Electrical', 'area' => 'North/East', 'contact_phone' => '555-6060', 'rating' => 4.3],
            ['name' => 'Clean & Clear', 'category' => 'Cleaning', 'area' => 'South Sector', 'contact_phone' => '555-7070', 'rating' => 4.5],
        ];

        foreach ($services as $index => $serviceData) {
            $provider = $providers[$index % $providers->count()];
            Service::create(array_merge($serviceData, ['provider_id' => $provider->id]));
        }
    }
}
