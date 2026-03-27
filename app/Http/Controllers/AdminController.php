<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Shop;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\BloodBank;
use App\Models\Hospital;

class AdminController extends Controller
{
    public function pendingUsers()
    {
        $users = User::where('is_approved', false)
            ->where('role', '!=', 'User')
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
            'users_pending' => User::where('is_approved', false)->where('role', '!=', 'User')->count(),
            'shops_pending' => Shop::where('is_approved', false)->count(),
            'services_pending' => Service::where('is_approved', false)->count(),
            'total_users' => User::count(),
            'total_shops' => Shop::count(),
            'total_services' => Service::count(),
        ]);
    }

    public function createBloodBankProvider(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'bank_name' => 'required',
            'address' => 'required',
            'contact' => 'required'
        ]);

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'BloodBank',
                'is_approved' => true
            ]);

            $bloodBank = BloodBank::create([
                'name' => $request->bank_name,
                'address' => $request->address,
                'contact' => $request->contact,
                'user_id' => $user->id
            ]);

            return response()->json([
                'message' => 'Blood Bank provider created successfully',
                'user' => $user,
                'blood_bank' => $bloodBank
            ]);
        });
    }

    public function createHospitalProvider(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'hospital_name' => 'required',
            'address' => 'required'
        ]);

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'Hospital',
                'is_approved' => true
            ]);

            $hospital = Hospital::create([
                'name' => $request->hospital_name,
                'address' => $request->address,
                'user_id' => $user->id,
                'crowd_status' => 'Low'
            ]);

            return response()->json([
                'message' => 'Hospital provider created successfully',
                'user' => $user,
                'hospital' => $hospital
            ]);
        });
    }
}
