<?php

use App\Http\Controllers\UserDashboard\UserDashboardController;
use App\Http\Controllers\UserDashboard\UserGarageController;
use App\Http\Controllers\UserDashboard\UserGaragePostController;
use App\Http\Controllers\UserDashboard\UserItemController;
use App\Http\Controllers\UserDashboard\UserShopController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/user-dashboard', [UserDashboardController::class, 'index']);
    // Item Route
    Route::resource('user-items', UserItemController::class);
    Route::post('user-items/{user_item}/update', [UserItemController::class, 'update']);
    Route::post('user-items/{user_item}/update_status', [UserItemController::class, 'update_status']);
    Route::delete('user-items/images/{image}', [UserItemController::class, 'destroy_image']);
    Route::get('admin/item_view_counts', [UserItemController::class, 'item_view_counts']);

    // Garage Post Route
    Route::resource('user-garage_posts', UserGaragePostController::class);
    Route::post('user-garage_posts/{user_garage_post}/update', [UserGaragePostController::class, 'update']);
    Route::post('user-garage_posts/{user_garage_post}/update_status', [UserGaragePostController::class, 'update_status']);
    Route::delete('user-garage_posts/images/{image}', [UserGaragePostController::class, 'destroy_image']);

    // Shop Route
    Route::get('user-shops/update', [UserShopController::class, 'edit']);
    Route::get('user-shops/create', [UserShopController::class, 'create']);
    Route::post('user-shops', [UserShopController::class, 'store']);
    Route::post('user-shops/{user_shop}/update', [UserShopController::class, 'update']);

    // Garage Route
    Route::get('user-garages/update', [UserGarageController::class, 'edit']);
    Route::get('user-garages/create', [UserGarageController::class, 'create']);
    Route::post('user-garages', [UserGarageController::class, 'store']);
    Route::post('user-garages/{user_garage}/update', [UserGarageController::class, 'update']);
});
