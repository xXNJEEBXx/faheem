<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\ChallengeSession;

class ChatController extends Controller
{
    public function startConversation(Request $request)
    {
        $conversation = Conversation::create([
            'session_token' => Str::uuid()->toString(),
            'status' => 'active',
        ]);

        return response()->json([
            'session_token' => $conversation->session_token,
            'message' => 'Conversation started successfully.'
        ]);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'session_token' => 'required|string|exists:conversations,session_token',
            'message' => 'required|string'
        ]);

        $conversation = Conversation::where('session_token', $request->input('session_token'))->firstOrFail();

        // Save user message
        $userMessage = Message::create([
            'conversation_id' => $conversation->id,
            'sender_type' => 'user',
            'content' => $request->input('message')
        ]);

        // Mock AI response for now
        $aiResponseContent = 'This is a mock AI response from the Laravel Backend.';

        // Save AI message
        $aiMessage = Message::create([
            'conversation_id' => $conversation->id,
            'sender_type' => 'ai',
            'content' => $aiResponseContent
        ]);

        return response()->json([
            'user_message' => $userMessage,
            'ai_message' => $aiMessage,
            'state' => 'idle'
        ]);
    }

    public function submitChallengeResult(Request $request)
    {
        $request->validate([
            'session_token' => 'required|string|exists:conversations,session_token',
            'user_guess' => 'required|in:ai,human'
        ]);

        $conversation = Conversation::where('session_token', $request->input('session_token'))->firstOrFail();

        // The actual identity is 'ai' for now according to the specification
        $actualIdentity = 'ai';
        $isCorrect = ($request->input('user_guess') === $actualIdentity);

        $challengeSession = ChallengeSession::create([
            'conversation_id' => $conversation->id,
            'user_guess' => $request->input('user_guess'),
            'actual_identity' => $actualIdentity,
            'is_correct' => $isCorrect
        ]);

        $conversation->update(['status' => 'ended']);

        return response()->json([
            'challenge_result' => $challengeSession,
            'message' => 'Challenge result submitted successfully.'
        ]);
    }

    public function getConversationHistory(Request $request)
    {
        $request->validate([
            'session_token' => 'required|string|exists:conversations,session_token'
        ]);

        $conversation = Conversation::where('session_token', $request->query('session_token'))
            ->with('messages', 'challengeSession')
            ->firstOrFail();

        return response()->json([
            'conversation' => $conversation
        ]);
    }
}
