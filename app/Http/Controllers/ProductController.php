<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return Product::all();
    }

    public function show(Product $product)
    {
        return $product->load('shop');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'name' => 'required|string',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = asset('storage/' . $path);
        }

        if ($request->hasFile('image_2')) {
            $path2 = $request->file('image_2')->store('products', 'public');
            $validated['image_url_2'] = asset('storage/' . $path2);
        }

        return Product::create($validated);
    }

    public function update(Request $request, Product $product)
    {
        $shop = $product->shop;
        if ($shop->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'string',
            'price' => 'numeric',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = asset('storage/' . $path);
        }

        if ($request->hasFile('image_2')) {
            $path2 = $request->file('image_2')->store('products', 'public');
            $validated['image_url_2'] = asset('storage/' . $path2);
        }

        $product->update($validated);
        return $product;
    }

    public function destroy(Request $request, Product $product)
    {
        $shop = $product->shop;
        if ($shop->owner_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }
}
