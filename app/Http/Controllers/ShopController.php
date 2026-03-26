<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        return Shop::where('is_approved', true)->with('products')->get();
    }

    public function myShops(Request $request)
    {
        return Shop::where('owner_id', $request->user()->id)->get();
    }

    public function show(Shop $shop)
    {
        return $shop->load('products');
    }

    public function products(Shop $shop)
    {
        return $shop->products;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'address' => 'required|string',
            'contact_phone' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('shops', 'public');
            $validated['image_url'] = asset('storage/' . $path);
        }

        $validated['owner_id'] = $request->user()->id;
        return Shop::create($validated);
    }

    public function update(Request $request, Shop $shop)
    {
        if ($shop->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'string',
            'category' => 'string',
            'description' => 'nullable|string',
            'address' => 'string',
            'contact_phone' => 'string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('shops', 'public');
            $validated['image_url'] = asset('storage/' . $path);
        }

        $shop->update($validated);
        return $shop;
    }

    public function destroy(Request $request, Shop $shop)
    {
        if ($shop->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $shop->delete();
        return response()->json(['message' => 'Shop deleted']);
    }
}
