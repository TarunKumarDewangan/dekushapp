<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    protected $fillable = [
        'name',
        'category',
        'description',
        'address',
        'contact_phone',
        'image_url',
        'owner_id',
        'latitude',
        'longitude',
    ];

    protected $appends = ['average_rating', 'rating_count'];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function ratings()
    {
        return $this->morphMany(Rating::class, 'ratable');
    }

    public function getAverageRatingAttribute()
    {
        $avg = $this->ratings()->avg('rating');
        return $avg ? round($avg, 1) : 2.5; // Default to 2.5 as requested
    }

    public function getRatingCountAttribute()
    {
        return $this->ratings()->count();
    }
}
