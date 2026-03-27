<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Hospital;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index(Request $request)
    {
        $hospital = Hospital::where('user_id', $request->user()->id)->first();
        
        if (!$hospital) {
            return response()->json(['message' => 'No hospital assigned'], 404);
        }

        return $hospital->doctors;
    }

    public function store(Request $request)
    {
        $hospital = Hospital::where('user_id', $request->user()->id)->first();
        
        if (!$hospital) {
            return response()->json(['message' => 'No hospital assigned'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'specialty' => 'required|string',
            'type' => 'required|in:Staff,Consultant,Outside',
            'is_available' => 'boolean',
            'visiting_days' => 'nullable|string',
            'visiting_hours' => 'nullable|string',
        ]);

        $validated['hospital_id'] = $hospital->id;
        
        $doctor = Doctor::create($validated);

        return response()->json([
            'message' => 'Doctor added successfully',
            'doctor' => $doctor
        ]);
    }

    public function update(Request $request, Doctor $doctor)
    {
        $hospital = Hospital::where('user_id', $request->user()->id)->first();
        
        if (!$hospital || $doctor->hospital_id !== $hospital->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'string',
            'specialty' => 'string',
            'type' => 'in:Staff,Consultant,Outside',
            'is_available' => 'boolean',
            'visiting_days' => 'nullable|string',
            'visiting_hours' => 'nullable|string',
        ]);

        $doctor->update($validated);

        return response()->json([
            'message' => 'Doctor updated successfully',
            'doctor' => $doctor
        ]);
    }

    public function destroy(Request $request, Doctor $doctor)
    {
        $hospital = Hospital::where('user_id', $request->user()->id)->first();
        
        if (!$hospital || $doctor->hospital_id !== $hospital->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $doctor->delete();

        return response()->json(['message' => 'Doctor deleted successfully']);
    }
}
