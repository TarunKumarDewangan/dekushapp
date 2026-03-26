<?php

namespace App\Http\Controllers;

use App\Models\Ambulance;
use Illuminate\Http\Request;

class AmbulanceController extends Controller
{
    // Public routes handled in api.php
    // public function __construct()
    // {
    //     $this->middleware('auth:sanctum');
    // }

    private function checkAdmin()
    {
        if (auth()->user()->role !== 'Admin') {
            abort(403, 'Unauthorized. Admin only.');
        }
    }

    public function index()
    {
        return Ambulance::all();
    }

    public function store(Request $request)
    {
        $this->checkAdmin();
        $validated = $request->validate([
            'name' => 'required|string',
            'contact' => 'required|string',
            'vehicle_number' => 'nullable|string|unique:ambulances',
            'status' => 'required|in:Available,Busy',
        ]);

        return Ambulance::create($validated);
    }

    public function update(Request $request, Ambulance $ambulance)
    {
        $this->checkAdmin();
        $validated = $request->validate([
            'name' => 'string',
            'contact' => 'string',
            'vehicle_number' => 'nullable|string|unique:ambulances,vehicle_number,' . $ambulance->id,
            'status' => 'in:Available,Busy',
        ]);

        $ambulance->update($validated);
        return $ambulance;
    }

    public function destroy(Ambulance $ambulance)
    {
        $this->checkAdmin();
        $ambulance->delete();
        return response()->json(['message' => 'Ambulance deleted']);
    }
}
