<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChallengeSession extends Model
{
    protected $fillable = ['conversation_id', 'user_guess', 'actual_identity', 'is_correct'];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }
}
