<?php

namespace Database\Seeders;

use App\Models\Ambulance;
use Illuminate\Database\Seeder;

class AmbulanceSeeder extends Seeder
{
    public function run(): void
    {
        // Truncate first to avoid old data
        Ambulance::truncate();

        $ambulances = [
            ['name' => 'Gupta Hospital', 'contact' => '+919644296666', 'status' => 'Available', 'vehicle_number' => 'AMB-001'],
            ['name' => 'Jagat Ambulance', 'contact' => '+919301447795', 'status' => 'Available', 'vehicle_number' => 'AMB-002'],
            ['name' => 'Hemant Sahu', 'contact' => '+919669030021', 'status' => 'Available', 'vehicle_number' => 'AMB-003'],
            ['name' => 'Gupta Ambulance', 'contact' => '+919399520083', 'status' => 'Available', 'vehicle_number' => 'AMB-004'],
            ['name' => 'Duman Sahu', 'contact' => '+917898285331', 'status' => 'Available', 'vehicle_number' => 'AMB-005'],
            ['name' => 'Khan Ambulance', 'contact' => '+917869822640', 'status' => 'Available', 'vehicle_number' => 'AMB-006'],
            ['name' => 'Manish Ambulances', 'contact' => '+919993142466', 'status' => 'Available', 'vehicle_number' => 'AMB-007'],
            ['name' => 'Shri ram hospital dhamtari', 'contact' => '+918871084147', 'status' => 'Available', 'vehicle_number' => 'AMB-008'],
            ['name' => 'khan ambulance', 'contact' => '+917489444899', 'status' => 'Available', 'vehicle_number' => 'AMB-009'],
            ['name' => 'BSR Ambulance', 'contact' => '+919131488711', 'status' => 'Available', 'vehicle_number' => 'AMB-010'],
            ['name' => 'Mohamad Sohail', 'contact' => '+917489444899', 'status' => 'Available', 'vehicle_number' => 'AMB-011'],
            ['name' => 'Bhupendra Sahu', 'contact' => '+919399074908', 'status' => 'Available', 'vehicle_number' => 'AMB-012'],
            ['name' => 'Sharif Bhai', 'contact' => '+919098401011', 'status' => 'Available', 'vehicle_number' => 'AMB-013'],
            ['name' => 'Hamdard Ambulance', 'contact' => '+918959829749', 'status' => 'Available', 'vehicle_number' => 'AMB-014'],
            ['name' => 'unknown', 'contact' => '+917828797370', 'status' => 'Available', 'vehicle_number' => 'AMB-015'],
            ['name' => 'Gupta Hospital 2', 'contact' => '+919644306666', 'status' => 'Available', 'vehicle_number' => 'AMB-016'],
            ['name' => 'Gupta Hospital 3', 'contact' => '+919644009057', 'status' => 'Available', 'vehicle_number' => 'AMB-017'],
        ];

        foreach ($ambulances as $ambulance) {
            Ambulance::create($ambulance);
        }
    }
}
