<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('cam-active/Index');
})->name('home');

Route::get('/solutions', function () {
    return Inertia::render('cam-active/Solutions');
});

Route::get('/company', function () {
    return Inertia::render('cam-active/Company');
});

Route::get('/blogs', function () {
    return Inertia::render('cam-active/Blogs');
});

Route::get('/career', function () {
    return Inertia::render('cam-active/Career');
});

Route::get('/contact', function () {
    return Inertia::render('cam-active/Contact');
});