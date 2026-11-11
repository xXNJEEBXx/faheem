<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\ChallengeSession;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): Admin
    {
        return Admin::create([
            'name' => 'Test Administrator',
            'email' => 'admin@example.test',
            'password' => 'TestingPassword123',
        ]);
    }

    public function test_guests_cannot_read_records_or_create_admins(): void
    {
        $this->getJson('/api/chat/challenges')->assertUnauthorized();
        $this->postJson('/api/admin/register', [])->assertUnauthorized();
        $this->postJson('/api/admin/logout')->assertUnauthorized();
    }

    public function test_regular_users_are_not_administrators(): void
    {
        $this->actingAs(User::factory()->create(), 'sanctum');
        $this->getJson('/api/chat/challenges')->assertForbidden();
        $this->postJson('/api/admin/register', [])->assertForbidden();
    }

    public function test_valid_login_returns_expiring_token_without_exposing_password(): void
    {
        $admin = $this->admin();
        $response = $this->postJson('/api/admin/login', [
            'email' => 'ADMIN@example.test', 'password' => 'TestingPassword123',
        ])->assertOk()->assertJsonPath('admin.id', $admin->id)->assertJsonMissingPath('admin.password');

        $this->assertTrue(Hash::check('TestingPassword123', $admin->password));
        $this->assertNotEquals('TestingPassword123', $admin->password);
        $this->assertNotNull($admin->tokens()->first()->expires_at);
        $this->withToken($response->json('token'))->getJson('/api/chat/challenges')->assertOk();
    }

    public function test_wrong_credentials_and_unknown_email_have_the_same_error(): void
    {
        $this->admin();
        $wrong = $this->postJson('/api/admin/login', [
            'email' => 'admin@example.test', 'password' => 'IncorrectPassword123',
        ])->assertUnprocessable();
        $unknown = $this->postJson('/api/admin/login', [
            'email' => 'unknown@example.test', 'password' => 'IncorrectPassword123',
        ])->assertUnprocessable();
        $this->assertSame($wrong->json('errors'), $unknown->json('errors'));
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_login_attempts_are_rate_limited(): void
    {
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/admin/login', [
                'email' => 'unknown@example.test', 'password' => 'IncorrectPassword123',
            ])->assertUnprocessable();
        }
        $this->postJson('/api/admin/login', [
            'email' => 'unknown@example.test', 'password' => 'IncorrectPassword123',
        ])->assertStatus(429);
    }

    public function test_admin_can_register_another_admin_with_hashed_password(): void
    {
        $token = $this->admin()->createToken('test')->plainTextToken;
        $this->withToken($token)->postJson('/api/admin/register', [
            'name' => 'Second Admin', 'email' => 'SECOND@example.test',
            'password' => 'AnotherPassword123', 'password_confirmation' => 'AnotherPassword123',
        ])->assertCreated()->assertJsonPath('admin.email', 'second@example.test')
            ->assertJsonMissingPath('admin.password');
        $this->assertTrue(Hash::check('AnotherPassword123', Admin::where('email', 'second@example.test')->firstOrFail()->password));
    }

    public function test_registration_rejects_duplicates_weak_and_mismatched_passwords(): void
    {
        $token = $this->admin()->createToken('test')->plainTextToken;
        $this->withToken($token)->postJson('/api/admin/register', [
            'name' => 'Duplicate', 'email' => 'ADMIN@example.test',
            'password' => 'short', 'password_confirmation' => 'different',
        ])->assertUnprocessable()->assertJsonValidationErrors(['email', 'password']);
        $this->assertDatabaseCount('admins', 1);
    }

    public function test_expired_and_invalid_tokens_are_rejected(): void
    {
        $expired = $this->admin()->createToken('expired', ['admin'], now()->subMinute())->plainTextToken;
        $this->withToken($expired)->getJson('/api/chat/challenges')->assertUnauthorized();
        $this->withToken('invalid-token')->getJson('/api/chat/challenges')->assertUnauthorized();
    }

    public function test_logout_revokes_the_token(): void
    {
        $token = $this->admin()->createToken('test')->plainTextToken;
        $this->withToken($token)->postJson('/api/admin/logout')->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
        // A fresh request must resolve its guard again after token revocation.
        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/chat/challenges')->assertUnauthorized();
    }

    public function test_admin_can_review_existing_challenges_and_messages(): void
    {
        $conversation = Conversation::create(['session_token' => (string) Str::uuid(), 'status' => 'ended']);
        Message::create(['conversation_id' => $conversation->id, 'sender_type' => 'user', 'content' => 'Test message']);
        ChallengeSession::create([
            'conversation_id' => $conversation->id, 'user_guess' => 'ai', 'actual_identity' => 'ai', 'is_correct' => true,
        ]);
        $this->withToken($this->admin()->createToken('test')->plainTextToken)
            ->getJson('/api/chat/challenges')->assertOk()
            ->assertJsonCount(1, 'challenges')
            ->assertJsonPath('challenges.0.conversation.messages.0.content', 'Test message');
    }

    public function test_admin_can_delete_individual_and_all_challenge_conversations(): void
    {
        $conversation1 = Conversation::create(['session_token' => (string) Str::uuid(), 'status' => 'ended']);
        Message::create(['conversation_id' => $conversation1->id, 'sender_type' => 'user', 'content' => 'Message 1']);
        $challenge1 = ChallengeSession::create([
            'conversation_id' => $conversation1->id, 'user_guess' => 'ai', 'actual_identity' => 'ai', 'is_correct' => true,
        ]);

        $conversation2 = Conversation::create(['session_token' => (string) Str::uuid(), 'status' => 'ended']);
        Message::create(['conversation_id' => $conversation2->id, 'sender_type' => 'user', 'content' => 'Message 2']);
        $challenge2 = ChallengeSession::create([
            'conversation_id' => $conversation2->id, 'user_guess' => 'human', 'actual_identity' => 'human', 'is_correct' => true,
        ]);

        $adminToken = $this->admin()->createToken('test')->plainTextToken;

        // Guest cannot delete
        $this->deleteJson('/api/chat/challenges/'.$challenge1->id)->assertUnauthorized();
        $this->deleteJson('/api/chat/challenges')->assertUnauthorized();

        // Admin deletes challenge1
        $this->withToken($adminToken)->deleteJson('/api/chat/challenges/'.$challenge1->id)->assertOk();
        $this->assertDatabaseMissing('challenge_sessions', ['id' => $challenge1->id]);
        $this->assertDatabaseMissing('conversations', ['id' => $conversation1->id]);
        $this->assertDatabaseMissing('messages', ['content' => 'Message 1']);

        // Challenge2 still exists
        $this->assertDatabaseHas('challenge_sessions', ['id' => $challenge2->id]);

        // Admin deletes all
        $this->withToken($adminToken)->deleteJson('/api/chat/challenges')->assertOk();
        $this->assertDatabaseCount('challenge_sessions', 0);
        $this->assertDatabaseCount('conversations', 0);
        $this->assertDatabaseCount('messages', 0);
    }

    public function test_public_conversation_creation_is_still_available(): void
    {
        $this->postJson('/api/chat/start')->assertOk()->assertJsonStructure(['session_token']);
    }

    public function test_cli_creates_first_admin_and_rejects_duplicate_email(): void
    {
        $this->artisan('admin:create')
            ->expectsQuestion('Name', 'Initial Admin')
            ->expectsQuestion('Email', 'INITIAL@example.test')
            ->expectsQuestion('Password (12+ characters, upper/lowercase and numbers)', 'InitialPassword123')
            ->expectsQuestion('Confirm password', 'InitialPassword123')
            ->assertSuccessful();
        $this->assertDatabaseHas('admins', ['email' => 'initial@example.test']);
        $this->artisan('admin:create')
            ->expectsQuestion('Name', 'Duplicate')
            ->expectsQuestion('Email', 'initial@example.test')
            ->expectsQuestion('Password (12+ characters, upper/lowercase and numbers)', 'InitialPassword123')
            ->expectsQuestion('Confirm password', 'InitialPassword123')
            ->assertFailed();
        $this->assertDatabaseCount('admins', 1);
    }
}
