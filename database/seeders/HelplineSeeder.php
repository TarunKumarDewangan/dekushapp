<?php

namespace Database\Seeders;

use App\Models\Helpline;
use Illuminate\Database\Seeder;

class HelplineSeeder extends Seeder
{
    public function run(): void
    {
        Helpline::truncate();

        $helplines = [
            ['name' => 'National Emergency Helpline (Police / Fire / Ambulance)', 'number' => '112', 'category' => 'Emergency'],
            ['name' => 'Police', 'number' => '100', 'category' => 'Emergency'],
            ['name' => 'Fire Service', 'number' => '101', 'category' => 'Emergency'],
            ['name' => 'Ambulance Service (Government Emergency Health Service)', 'number' => '102', 'category' => 'Emergency'],
            ['name' => 'Free Emergency Ambulance/Medical Helpline', 'number' => '108', 'category' => 'Health'],
            ['name' => 'Health Helpline', 'number' => '104', 'category' => 'Health'],
            ['name' => 'National Highway Helpline (Accidents/Breakdown)', 'number' => '1033', 'category' => 'Traffic'],
            ['name' => 'Women Helpline', 'number' => '1091', 'category' => 'Women & Child'],
            ['name' => 'Child Helpline', 'number' => '1098', 'category' => 'Women & Child'],
            ['name' => 'State Disaster Management', 'number' => '1070', 'category' => 'Utilities'],
            ['name' => 'Electricity Complaint', 'number' => '1912', 'category' => 'Utilities'],
        ];

        foreach ($helplines as $helpline) {
            Helpline::create($helpline);
        }
    }
}
