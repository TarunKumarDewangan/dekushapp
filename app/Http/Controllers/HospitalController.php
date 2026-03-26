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

    public function doctors(Hospital $hospital)
    {
        return $hospital->doctors;
    }

    public function store(Request $request)
    {
        // Only Admin/HospitalAdmin should be able to store (middleware needed)
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
