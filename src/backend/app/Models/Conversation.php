<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = ['session_token', 'status'];

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function challengeSession()
    {
        return $this->hasOne(ChallengeSession::class);
    }
}
