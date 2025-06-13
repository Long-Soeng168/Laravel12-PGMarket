<?php

use App\Http\Controllers\RuleLibraryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', [RuleLibraryController::class, 'index']);
