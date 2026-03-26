<?php

namespace App\Http\Controllers;

use App\Models\BloodBank;
use Illuminate\Http\Request;

class BloodBankController extends Controller
{
    public function index()
    {
        return BloodBank::all();
    }

    public function myBloodBank(Request $request)
    {
        return BloodBank::where('user_id', $request->user()->id)->firstOrFail();
    }

    public function update(Request $request, $id)
    {
        $bloodBank = BloodBank::findOrFail($id);
        
        // Ensure user owns this blood bank
        if ($bloodBank->user_id !== $request->user()->id && $request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $bloodBank->update($request->all());
        return response()->json(['message' => 'Blood Bank updated successfully', 'blood_bank' => $bloodBank]);
    }
}
