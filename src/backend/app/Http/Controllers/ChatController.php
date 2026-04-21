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
            'message' => 'required|string',
            'sender_type' => 'required|in:user,ai'
        ]);

        $conversation = Conversation::where('session_token', $request->input('session_token'))->firstOrFail();

        if ($conversation->status === 'ended') {
            return response()->json(['message' => 'Cannot send messages to an ended conversation.'], 403);
        }

        // Save message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_type' => $request->input('sender_type'),
            'content' => $request->input('message')
        ]);

        return response()->json([
            'saved_message' => $message,
            'state' => 'success'
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
