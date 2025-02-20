<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;

Route::get('login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('login', [LoginController::class, 'login']);
Route::post('logout', [LoginController::class, 'logout'])->name('logout');

Route::get('formulario', function () {
    return view('formulario');
})->middleware('auth');
