<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('westec/Index');
})->name('home');
Route::get('/about', function () {
    return Inertia::render('westec/About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('westec/Contact');
})->name('contact');

Route::get('/solutions', function () {
    return Inertia::render('westec/Solutions');
})->name('solutions');

Route::get('/case_studies', function () {
    return Inertia::render('westec/CaseStudies');
})->name('case_studies');

Route::get('/career', function () {
    return Inertia::render('westec/Career');
})->name('career');

Route::get('/detail/{id}', function ($id) {
    return Inertia::render('westec/Detail', [
        'id' => $id,
    ]);
})->name('detail');
