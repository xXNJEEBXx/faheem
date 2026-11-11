<?php

namespace Tests\Feature;

use App\Models\Conversation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Tests\TestCase;

class GeminiProxyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'services.openrouter.key' => '',
            'services.gemini.key' => 'test-only-secret',
            'services.gemini.model' => 'test-model',
        ]);
        Http::preventStrayRequests();
    }

    private function payload(string $status = 'active'): array
    {
        $conversation = Conversation::create(['session_token' => (string) Str::uuid(), 'status' => $status]);

        return [
            'session_token' => $conversation->session_token,
            'persona' => 'faheem',
            'history' => [['sender' => 'user', 'content' => 'هلا، كيف الحال؟']],
        ];
    }

    public function test_server_sends_secret_in_header_and_returns_only_generated_text(): void
    {
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [['content' => ['parts' => [['text' => 'هلا والله!']]]]],
            'private_metadata' => 'not-for-browser',
        ])]);
        $this->postJson('/api/chat/generate', $this->payload())->assertOk()
            ->assertExactJson(['reply' => 'هلا والله!'])->assertDontSee('test-only-secret');
        Http::assertSent(fn (ClientRequest $request) => $request->hasHeader('x-goog-api-key', 'test-only-secret')
            && ! str_contains($request->url(), 'test-only-secret')
            && $request['contents'][0]['role'] === 'user'
            && isset($request['system_instruction'])
            && $request['generationConfig']['maxOutputTokens'] === 512);
    }

    public function test_human_persona_is_also_generated_on_server(): void
    {
        Http::fake(['*' => Http::response(['candidates' => [['content' => ['parts' => [['text' => 'هلا']]]]]])]);
        $data = $this->payload();
        $data['persona'] = 'human';
        $this->postJson('/api/chat/generate', $data)->assertOk();
        Http::assertSent(fn (ClientRequest $request) => str_contains($request['system_instruction']['parts'][0]['text'], 'تحاكي شخصية'));
    }

    public function test_invalid_session_and_persona_do_not_call_provider(): void
    {
        $data = $this->payload();
        $data['session_token'] = 'unknown';
        $data['persona'] = 'arbitrary';
        $this->postJson('/api/chat/generate', $data)->assertUnprocessable()
            ->assertJsonValidationErrors(['session_token', 'persona']);
        Http::assertNothingSent();
    }

    public function test_ended_conversation_does_not_call_provider(): void
    {
        $this->postJson('/api/chat/generate', $this->payload('ended'))->assertForbidden();
        Http::assertNothingSent();
    }

    public function test_oversized_or_malformed_history_is_rejected(): void
    {
        $data = $this->payload();
        $data['history'][0]['content'] = str_repeat('x', 2001);
        $this->postJson('/api/chat/generate', $data)->assertUnprocessable();
        $data['history'] = array_fill(0, 7, ['sender' => 'user', 'content' => str_repeat('x', 2000)]);
        $this->postJson('/api/chat/generate', $data)->assertUnprocessable();
        $data['history'] = [['sender' => 'opponent', 'content' => 'not a user message']];
        $this->postJson('/api/chat/generate', $data)->assertUnprocessable();
        Http::assertNothingSent();
    }

    public function test_missing_key_returns_configuration_error_without_network_call(): void
    {
        config(['services.gemini.key' => '']);
        $this->postJson('/api/chat/generate', $this->payload())->assertStatus(503);
        Http::assertNothingSent();
    }

    public function test_provider_errors_do_not_leak_provider_body_or_key(): void
    {
        Http::fake(['*' => Http::response(['error' => 'test-only-secret upstream diagnostic'], 403)]);
        $this->postJson('/api/chat/generate', $this->payload())->assertStatus(503)
            ->assertExactJson(['message' => 'AI service is temporarily unavailable.']);
    }

    public function test_connection_failure_returns_safe_error(): void
    {
        Http::fake(['*' => Http::failedConnection('test-only-secret')]);
        $this->postJson('/api/chat/generate', $this->payload())->assertStatus(503)
            ->assertDontSee('test-only-secret');
    }

    public function test_empty_output_is_handled(): void
    {
        Http::fake(['*' => Http::response(['candidates' => []])]);
        $this->postJson('/api/chat/generate', $this->payload())->assertStatus(503)
            ->assertJsonPath('message', 'AI service returned no response.');
    }

    public function test_session_request_limit_prevents_additional_provider_calls(): void
    {
        Http::fake(['*' => Http::response(['candidates' => [['content' => ['parts' => [['text' => 'hello']]]]]])]);
        $data = $this->payload();
        for ($attempt = 0; $attempt < 10; $attempt++) {
            $this->postJson('/api/chat/generate', $data)->assertOk();
        }
        $this->postJson('/api/chat/generate', $data)->assertStatus(429);
        Http::assertSentCount(10);
    }
}
