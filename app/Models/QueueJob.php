<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QueueJob extends Model
{
    protected $guarded = [];

    protected $casts = [
        'payload' => 'array',
    ];
}
