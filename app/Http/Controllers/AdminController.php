<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Shop;
use App\Models\Service;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function pendingUsers()
    {
        $users = User::where('is_approved', false)
            ->whereIn('role', ['ShopOwner', 'Provider'])
            ->get();
        return response()->json($users);
    }

    public function approveUser($id)
    {
        $user = User::findOrFail($id);
        $user->is_approved = true;
        $user->save();
        return response()->json(['message' => 'User approved successfully']);
    }

    public function pendingShops()
    {
        $shops = Shop::where('is_approved', false)->with('owner')->get();
        return response()->json($shops);
    }

    public function approveShop($id)
    {
        $shop = Shop::findOrFail($id);
        $shop->is_approved = true;
        $shop->save();
        return response()->json(['message' => 'Shop approved successfully']);
    }

    public function pendingServices()
    {
        $services = Service::where('is_approved', false)->with('provider')->get();
        return response()->json($services);
    }

    public function approveService($id)
    {
        $service = Service::findOrFail($id);
        $service->is_approved = true;
        $service->save();
        return response()->json(['message' => 'Service approved successfully']);
    }

    public function stats()
    {
        return response()->json([
            'users_pending' => User::where('is_approved', false)->whereIn('role', ['ShopOwner', 'Provider'])->count(),
            'shops_pending' => Shop::where('is_approved', false)->count(),
            'services_pending' => Service::where('is_approved', false)->count(),
            'total_users' => User::count(),
            'total_shops' => Shop::count(),
            'total_services' => Service::count(),
        ]);
    }
}
