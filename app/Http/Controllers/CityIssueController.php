<?php

namespace App\Http\Controllers;

use App\Models\CityIssue;
use Illuminate\Http\Request;

class CityIssueController extends Controller
{
    public function index(Request $request)
    {
        return CityIssue::where('user_id', $request->user()->id)->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'description' => 'required|string',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'Open';

        return CityIssue::create($validated);
    }

    public function show(CityIssue $cityIssue)
    {
        // Ensure user can only see their own issues
        if ($cityIssue->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return $cityIssue;
    }

    public function update(Request $request, CityIssue $cityIssue)
    {
        if ($cityIssue->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'type' => 'string',
            'description' => 'string',
            'status' => 'string|in:Open,In Progress,Resolved,Closed',
        ]);

        $cityIssue->update($validated);
        return $cityIssue;
    }

    public function destroy(Request $request, CityIssue $cityIssue)
    {
        if ($cityIssue->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cityIssue->delete();
        return response()->json(['message' => 'City issue deleted']);
    }
}
