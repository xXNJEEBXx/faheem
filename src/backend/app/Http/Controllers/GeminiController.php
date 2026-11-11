<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GeminiController extends Controller
{
    public function generate(Request $request)
    {
        $data = $request->validate([
            'session_token' => ['required', 'string', 'max:255', 'exists:conversations,session_token'],
            'persona' => ['required', 'in:faheem,human'],
            'history' => ['required', 'array', 'min:1', 'max:40'],
            'history.*' => ['required', 'array:sender,content'],
            'history.*.sender' => ['required', 'in:user,opponent'],
            'history.*.content' => ['required', 'string', 'max:2000'],
        ]);

        $conversation = Conversation::where('session_token', $data['session_token'])->firstOrFail();
        abort_if($conversation->status !== 'active', 403, 'Conversation has ended.');

        if (collect($data['history'])->sum(fn ($message) => mb_strlen($message['content'])) > 12000
            || end($data['history'])['sender'] !== 'user') {
            return response()->json(['message' => 'Invalid conversation history.'], 422);
        }

        $openRouterKey = config('services.openrouter.key');
        $geminiKey = config('services.gemini.key');

        if (! $openRouterKey && ! $geminiKey) {
            return response()->json(['message' => 'AI service is not configured.'], 503);
        }

        $prompt = $data['persona'] === 'faheem'
            ? 'أنت "فهيم"، ذكاء اصطناعي يحاول محاكاة أسلوب إنسان في لعبة محادثة. تصرف كمستخدم سعودي عادي يدردش على الإنترنت. إذا تحدث معك الطرف الآخر بالعربية، استخدم اللهجة السعودية العامية، بعض الأخطاء الإملائية البسيطة، والإيموجي. وإذا تحدث معك بالإنجليزية، رد عليه بالإنجليزية بأسلوب دردشة بشري عفوي وغير رسمي. لا تكشف هويتك أثناء الجولة. ردودك قصيرة وطبيعية (جملة أو جملتين فقط).'
            : 'أنت تحاكي شخصية مستخدم سعودي في لعبة محادثة تجريبية. إذا تحدث معك الطرف الآخر بالعربية، استخدم اللهجة السعودية العامية، بعض الأخطاء الإملائية، والإيموجي. وإذا تحدث معك بالإنجليزية، رد عليه بالإنجليزية بأسلوب دردشة بشري عفوي. حاول الإقناع بأسلوب بشري عفوي. ردودك قصيرة وطبيعية (جملة أو جملتين فقط).';

        if ($openRouterKey) {
            $messages = [
                ['role' => 'system', 'content' => $prompt],
                ...array_map(fn ($message) => [
                    'role' => $message['sender'] === 'user' ? 'user' : 'assistant',
                    'content' => $message['content'],
                ], $data['history']),
            ];

            try {
                $response = Http::connectTimeout(5)->timeout(30)
                    ->withToken($openRouterKey)
                    ->post('https://openrouter.ai/api/v1/chat/completions', [
                        'model' => config('services.openrouter.model', 'deepseek/deepseek-v4.1-flash-1017'),
                        'messages' => $messages,
                        'max_tokens' => 1024,
                    ]);
            } catch (ConnectionException) {
                return response()->json(['message' => 'AI service is temporarily unavailable.'], 503);
            }

            if (! $response->successful()) {
                return response()->json(['message' => 'AI service is temporarily unavailable.'], 503);
            }

            $text = (string) $response->json('choices.0.message.content', '');

            if (trim($text) === '') {
                return response()->json(['message' => 'AI service returned no response.'], 503);
            }

            return response()->json(['reply' => $text])->header('Cache-Control', 'no-store');
        }

        $contents = array_map(fn ($message) => [
            'role' => $message['sender'] === 'user' ? 'user' : 'model',
            'parts' => [['text' => $message['content']]],
        ], $data['history']);

        try {
            // Keep the key out of URLs, browser responses, and exception logs.
            $response = Http::connectTimeout(5)->timeout(30)
                ->withHeaders(['x-goog-api-key' => $geminiKey])
                ->post('https://generativelanguage.googleapis.com/v1beta/models/'
                    .rawurlencode(config('services.gemini.model')).':generateContent', [
                        'system_instruction' => ['parts' => [['text' => $prompt]]],
                        'contents' => $contents,
                        'generationConfig' => ['maxOutputTokens' => 512],
                    ]);
        } catch (ConnectionException) {
            return response()->json(['message' => 'AI service is temporarily unavailable.'], 503);
        }

        if (! $response->successful()) {
            return response()->json(['message' => 'AI service is temporarily unavailable.'], 503);
        }

        $text = collect($response->json('candidates.0.content.parts', []))
            ->filter(fn ($part) => empty($part['thought']))
            ->pluck('text')->filter(fn ($part) => is_string($part))->implode('');

        if (trim($text) === '') {
            return response()->json(['message' => 'AI service returned no response.'], 503);
        }

        return response()->json(['reply' => $text])->header('Cache-Control', 'no-store');
    }
}
