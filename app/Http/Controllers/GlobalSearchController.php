<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Hospital;
use App\Models\Shop;
use App\Models\Service;

class GlobalSearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q');

        if (!$query) {
            return response()->json([
                'hospitals' => [],
                'shops' => [],
                'services' => [],
            ]);
        }

        $hospitals = Hospital::where('name', 'LIKE', "%{$query}%")
            ->orWhere('address', 'LIKE', "%{$query}%")
            ->get();

        $shops = Shop::where('name', 'LIKE', "%{$query}%")
            ->orWhere('category', 'LIKE', "%{$query}%")
            ->get();

        $services = Service::where('name', 'LIKE', "%{$query}%")
            ->orWhere('category', 'LIKE', "%{$query}%")
            ->get();

        return response()->json([
            'hospitals' => $hospitals,
            'shops' => $shops,
            'services' => $services,
        ]);
    }
}
