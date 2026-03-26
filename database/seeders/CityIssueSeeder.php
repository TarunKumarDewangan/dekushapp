<?php

namespace Database\Seeders;

use App\Models\CityIssue;
use App\Models\User;
use Illuminate\Database\Seeder;

class CityIssueSeeder extends Seeder
{
    public function run(): void
    {
        $citizens = User::where('role', 'Citizen')->get();

        if ($citizens->isEmpty()) {
            return;
        }

        $issues = [
            ['type' => 'Infrastructure', 'description' => 'Pothole on Cross Road 5, needs urgent repair.', 'status' => 'Open'],
            ['type' => 'Utility', 'description' => 'Street lights are not working for the last 3 days in Block B.', 'status' => 'In Progress'],
            ['type' => 'Sanitation', 'description' => 'Garbage collection missed for this week in North sector.', 'status' => 'Open'],
            ['type' => 'Safety', 'description' => 'Broken fence near the community park.', 'status' => 'Resolved'],
        ];

        foreach ($issues as $index => $issueData) {
            $user = $citizens[$index % $citizens->count()];
            CityIssue::create(array_merge($issueData, ['user_id' => $user->id]));
        }
    }
}
