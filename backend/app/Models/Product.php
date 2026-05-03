<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'seller_id',
        'name',
        'slug',
        'description',
        'price',
        'stock_quantity',
        'image_url',
        'is_archived'
    ];

    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function favoritedBy()
    {
        return $this->hasMany(Favorite::class);
    }
}
