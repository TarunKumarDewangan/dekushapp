<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hospital extends Model
{
    protected $fillable = ['name', 'address', 'crowd_status', 'rating'];

    public function doctors()
    {
        return $this->hasMany(Doctor::class);
    }
}
