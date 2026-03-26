<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        // Only show services from approved providers that are marked as available
        return Service::whereHas('provider', function($query) {
            $query->where('is_approved', true);
        })->where('is_available', true)->get();
    }

    public function myServices(Request $request)
    {
        return Service::where('provider_id', $request->user()->id)->get();
    }

    public function show(Service $service)
    {
        return $service->load('provider');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'area' => 'required|string',
            'contact_phone' => 'required|string',
            'description' => 'nullable|string',
            'is_available' => 'boolean'
        ]);

        $validated['provider_id'] = $request->user()->id;
        $validated['is_available'] = $request->has('is_available') ? $request->is_available : true;
        
        return Service::create($validated);
    }

    public function update(Request $request, Service $service)
    {
        if ($service->provider_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'string',
            'category' => 'string',
            'area' => 'string',
            'contact_phone' => 'string',
            'description' => 'nullable|string',
            'is_available' => 'boolean'
        ]);

        $service->update($validated);
        return $service;
    }

    public function destroy(Request $request, Service $service)
    {
        if ($service->provider_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $service->delete();
        return response()->json(['message' => 'Service deleted']);
    }
}
