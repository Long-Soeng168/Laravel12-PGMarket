<?php

use App\Http\Controllers\StreamFileController;
use Illuminate\Support\Facades\Route;

// Default Homepage
Route::get('/', function () {
   // return Inertia::render('LaravelDefaultPage');
   return redirect('/dashboard');
})->name('home');

// Switch Language
Route::get('/lang/{locale}', function ($locale) {
   if (!in_array($locale, ['en', 'kh'])) {
      abort(404);
   }
   session(['locale' => $locale]);
   return redirect()->back();
});

// Stream File
Route::get('show_pdf_file/{path}', [StreamFileController::class, 'streamPdf'])->where('path', '.*');

// ========= Client =========
require __DIR__ . '/nokor_tech.php';



// ========= Admin =========
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

require __DIR__ . '/user-dashboard.php';
require __DIR__ . '/admin.php';

require __DIR__ . '/file_manager.php';
require __DIR__ . '/order.php';


// ========= Telegram Testing Route =========
require __DIR__ . '/telegram.php';


// ========= Pay Pal Route =========
Route::get('/test_payment', '\App\Http\Controllers\PayPalController@index');
Route::get('/create/{amount}', '\App\Http\Controllers\PayPalController@create');
Route::post('/complete', '\App\Http\Controllers\PayPalController@complete');

// Stripe Payment Route
Route::get('/test_stripe', 'App\Http\Controllers\StripeController@checkout')->name('checkout');
Route::post('/test', 'App\Http\Controllers\StripeController@test');
Route::post('/live', 'App\Http\Controllers\StripeController@live');
Route::get('/success/{id}', 'App\Http\Controllers\StripeController@success')->name('success');
