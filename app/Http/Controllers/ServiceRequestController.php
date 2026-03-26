<?php

namespace App\Http\Controllers;

use App\Models\ServiceRequest;
use Illuminate\Http\Request;

class ServiceRequestController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'Pending';

        return ServiceRequest::create($validated);
    }

    public function index(Request $request)
    {
        return ServiceRequest::where('user_id', $request->user()->id)->with('service')->get();
    }
}
