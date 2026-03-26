<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\Hospital;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        $hospitals = Hospital::all();

        if ($hospitals->isEmpty()) {
            return;
        }

        $specialties = ['Cardiology', 'Pediatrics', 'Neurology', 'Orthopedics', 'Dermatology', 'General Medicine'];
        $types = ['Staff', 'Consultant', 'Resident'];

        foreach ($hospitals as $hospital) {
            // Create 3 doctors for each hospital
            for ($i = 1; $i <= 3; $i++) {
                Doctor::create([
                    'hospital_id' => $hospital->id,
                    'name' => 'Dr. ' . fake()->name(),
                    'specialty' => $specialties[array_rand($specialties)],
                    'type' => $types[array_rand($types)],
                    'is_available' => (bool)rand(0, 1),
                ]);
            }
        }
    }
}
