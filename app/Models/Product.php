<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['shop_id', 'name', 'price', 'description', 'image_url', 'image_url_2'];

    protected $appends = ['average_rating', 'rating_count'];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
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
