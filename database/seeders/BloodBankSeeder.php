<?php

namespace Database\Seeders;

use App\Models\BloodBank;
use Illuminate\Database\Seeder;

class BloodBankSeeder extends Seeder
{
    public function run(): void
    {
        BloodBank::truncate();

        BloodBank::create([
            'name' => 'City Blood Bank (Raipur)',
            'address' => 'G.E. Road, Opp. Magneto Mall, Raipur',
            'contact' => '+91 9876543210',
            'blood_groups_available' => 'A+, A-, B+, B-, O+, O-, AB+, AB-'
        ]);

        BloodBank::create([
            'name' => 'Red Cross Society Blood Bank',
            'address' => 'Jail Road, Near Kutchery Chowk, Raipur',
            'contact' => '+91 7712345678',
            'blood_groups_available' => 'A+, B+, O+, AB+'
        ]);

        BloodBank::create([
            'name' => 'Model Blood Bank (Mekahara)',
            'address' => 'Govt. Medical College Campus, Raipur',
            'contact' => '+91 7712233445',
            'blood_groups_available' => 'All major blood groups'
        ]);
    }
}
