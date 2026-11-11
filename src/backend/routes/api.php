<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\GeminiController;
use App\Http\Middleware\EnsureAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

// The deployed frontend and API are on different sites. Admin access uses
// short-lived bearer tokens held only in browser memory, without cookies.
Route::prefix('admin')->withoutMiddleware(EnsureFrontendRequestsAreStateful::class)->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login'])->middleware('throttle:5,1');
    Route::middleware(['auth:sanctum', EnsureAdmin::class])->group(function () {
        Route::post('/register', [AdminAuthController::class, 'register'])->middleware('throttle:10,1');
        Route::post('/logout', [AdminAuthController::class, 'logout']);
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('chat')->group(function () {
    Route::post('/start', [ChatController::class, 'startConversation']);
    Route::post('/generate', [GeminiController::class, 'generate'])->middleware('throttle:gemini');
    Route::post('/message', [ChatController::class, 'sendMessage']);
    Route::post('/challenge', [ChatController::class, 'submitChallengeResult']);
    Route::get('/history', [ChatController::class, 'getConversationHistory']);
    Route::get('/challenges', [ChatController::class, 'getAllChallenges'])
        ->withoutMiddleware(EnsureFrontendRequestsAreStateful::class)
        ->middleware(['auth:sanctum', EnsureAdmin::class]);
});
