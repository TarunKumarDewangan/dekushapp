<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $fillable = ['hospital_id', 'name', 'specialty', 'type', 'is_available'];

    public function hospital()
    {
        return $this->belongsTo(Hospital::class);
    }
}
