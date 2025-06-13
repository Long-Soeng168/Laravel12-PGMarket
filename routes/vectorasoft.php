<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/blog', function () {
    return Inertia::render('blog');
})->name('blog');
Route::get('/services', function () {
    return Inertia::render('services');
})->name('services');
Route::get('/detail/{id}', function ($id) {
    return Inertia::render('detail', [
        'id' => $id,
    ]);
})->name('detail');
Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');
Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');
