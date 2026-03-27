<?php

namespace App\Http\Controllers;

use App\Models\Hospital;
use Illuminate\Http\Request;

class HospitalController extends Controller
{
    public function index()
    {
        return Hospital::all();
    }

    public function show(Hospital $hospital)
    {
        return $hospital->load('doctors');
    }

    public function myHospital(Request $request)
    {
        $hospital = Hospital::where('user_id', $request->user()->id)->first();
        
        if (!$hospital) {
            return response()->json(['message' => 'No hospital assigned to this account'], 404);
        }
        
        return $hospital->load('doctors');
    }

    public function updateCrowd(Request $request)
    {
        $hospital = Hospital::where('user_id', $request->user()->id)->first();
        
        if (!$hospital) {
            return response()->json(['message' => 'No hospital assigned to this account'], 404);
        }

        $request->validate([
            'crowd_status' => 'required|in:Low,Medium,High',
        ]);

        $hospital->update(['crowd_status' => $request->crowd_status]);

        return response()->json([
            'message' => 'Crowd status updated successfully',
            'hospital' => $hospital
        ]);
    }

    public function doctors(Hospital $hospital)
    {
        return $hospital->doctors;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'crowd_status' => 'required|in:Low,Medium,High',
            'rating' => 'nullable|numeric|min:0|max:5',
        ]);

        return Hospital::create($validated);
    }

    public function update(Request $request, Hospital $hospital)
    {
        // Check if user is Admin or owns this hospital
        if ($request->user()->role !== 'Admin' && $hospital->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'string',
            'address' => 'string',
            'crowd_status' => 'string|in:Low,Medium,High',
            'rating' => 'numeric|min:0|max:5',
        ]);

        $hospital->update($validated);
        return $hospital;
    }
}
