<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ambulance extends Model
{
    protected $fillable = ['name', 'vehicle_number', 'contact', 'status'];
}
