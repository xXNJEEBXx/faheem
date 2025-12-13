<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function sendMessage(Request $request)
    {
        $message = $request->input('message');

        // Logic to process message via AI model would go here
        // For now, we return a mock response

        return response()->json([
            'response' => 'This is a response from the Laravel Backend.',
            'state' => 'idle'
        ]);
    }
}
