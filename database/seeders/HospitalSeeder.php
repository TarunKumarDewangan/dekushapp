<?php

namespace Database\Seeders;

use App\Models\Hospital;
use Illuminate\Database\Seeder;

class HospitalSeeder extends Seeder
{
    public function run(): void
    {
        $hospitals = [
            [
                'name' => 'City General Hospital',
                'address' => '123 Main St, Central District',
                'crowd_status' => 'Medium',
                'rating' => 4.5,
            ],
            [
                'name' => 'Sunshine Children\'s Hospital',
                'address' => '456 Oak Ave, North Sector',
                'crowd_status' => 'Low',
                'rating' => 4.8,
            ],
            [
                'name' => 'Metro Care Center',
                'address' => '789 Pine Rd, South Side',
                'crowd_status' => 'High',
                'rating' => 4.2,
            ],
            [
                'name' => 'St. Luke\'s Medical Plaza',
                'address' => '101 Elm Blvd, East End',
                'crowd_status' => 'Medium',
                'rating' => 4.6,
            ],
        ];

        foreach ($hospitals as $hospital) {
            Hospital::create($hospital);
        }
    }
}
