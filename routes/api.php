<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\AmbulanceController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ServiceRequestController;
use App\Http\Controllers\CityIssueController;
use App\Http\Controllers\HelplineController;
use App\Http\Controllers\BloodBankController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\GlobalSearchController;
use App\Http\Controllers\CityAssistantController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public Data Routes (Read-only)
Route::get('/hospitals', [HospitalController::class, 'index']);
Route::get('/hospitals/{hospital}', [HospitalController::class, 'show']);
Route::get('/hospitals/{hospital}/doctors', [HospitalController::class, 'doctors']);

Route::get('/ambulances', [AmbulanceController::class, 'index']);
Route::get('/ambulances/{ambulance}', [AmbulanceController::class, 'show']);

Route::get('/helplines', [HelplineController::class, 'index']);
Route::get('/blood-banks', [BloodBankController::class, 'index']);

Route::get('/shops', [ShopController::class, 'index']);
Route::get('/shops/{shop}', [ShopController::class, 'show']);
Route::get('/shops/{shop}/products', [ShopController::class, 'products']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{service}', [ServiceController::class, 'show']);

Route::get('/ratings', [RatingController::class, 'index']);
Route::get('/search', [GlobalSearchController::class, 'search']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    // Hospital Management (POST/PUT/DELETE if needed)
    Route::post('/hospitals', [HospitalController::class, 'store']);
    Route::put('/hospitals/{hospital}', [HospitalController::class, 'update']);
    Route::delete('/hospitals/{hospital}', [HospitalController::class, 'destroy']);

    // Ambulance Management
    Route::post('/ambulances', [AmbulanceController::class, 'store']);
    Route::put('/ambulances/{ambulance}', [AmbulanceController::class, 'update']);
    Route::delete('/ambulances/{ambulance}', [AmbulanceController::class, 'destroy']);

    // Shop Management
    Route::get('/my-shops', [ShopController::class, 'myShops']);
    Route::post('/shops', [ShopController::class, 'store']);
    Route::put('/shops/{shop}', [ShopController::class, 'update']);
    Route::delete('/shops/{shop}', [ShopController::class, 'destroy']);

    // Product Management
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    // Service Requests & Issues
    Route::apiResource('service-requests', ServiceRequestController::class);
    Route::apiResource('city-issues', CityIssueController::class);

    // Service Management for Providers
    Route::get('/my-services', [ServiceController::class, 'myServices']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{service}', [ServiceController::class, 'update']);
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

    // AI Assistant
    Route::post('/assistant', [CityAssistantController::class, 'ask']);

    // Ratings Submission
    Route::post('/ratings', [RatingController::class, 'store']);
});
