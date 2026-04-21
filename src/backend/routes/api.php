<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('chat')->group(function () {
    Route::post('/start', [ChatController::class, 'startConversation']);
    Route::post('/message', [ChatController::class, 'sendMessage']);
    Route::post('/challenge', [ChatController::class, 'submitChallengeResult']);
    Route::get('/history', [ChatController::class, 'getConversationHistory']);
});
