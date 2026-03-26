<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Users with different roles
        \App\Models\User::firstOrCreate(
            ['email' => 'admin@city.api'],
            [
                'name' => 'Admin User',
                'phone' => '1234567890',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'Admin',
                'is_approved' => true,
            ]
        );

        \App\Models\User::firstOrCreate(
            ['email' => 'shop@city.api'],
            [
                'name' => 'John Shopkeeper',
                'phone' => '9876543210',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'ShopOwner',
                'is_approved' => true,
            ]
        );

        \App\Models\User::firstOrCreate(
            ['email' => 'provider@city.api'],
            [
                'name' => 'Mike ServiceProvider',
                'phone' => '8887776666',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'Provider',
                'is_approved' => true,
            ]
        );

        \App\Models\User::firstOrCreate(
            ['email' => 'citizen@city.api'],
            [
                'name' => 'Regular Citizen',
                'phone' => '7776665555',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'Citizen',
                'is_approved' => true,
            ]
        );

        // 2. Call Seeders
        $this->call([
            HospitalSeeder::class,
            DoctorSeeder::class,
            AmbulanceSeeder::class,
            ShopSeeder::class,
            ServiceSeeder::class,
            CityIssueSeeder::class,
            BloodBankSeeder::class,
            HelplineSeeder::class,
        ]);
    }
}
