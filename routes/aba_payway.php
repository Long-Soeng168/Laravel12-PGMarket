<?php

use App\Http\Controllers\ABAPaywayCheckout;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/pay/aba_pay_interface', [ABAPaywayCheckout::class, 'aba_pay_interface']);
Route::get('/pay/aba', [ABAPaywayCheckout::class, 'abaPaywayCheckout'])->name('aba.pay');
Route::post('/pay/aba/callback', fn() => 'Callback')->name('aba.callback');
Route::get('/pay/aba/cancel', fn() => 'Canceled')->name('aba.cancel');
Route::get('/pay/aba/success', fn() => 'Success')->name('aba.success');
