<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Seller extends Model
{
    use HasApiTokens;
    protected $fillable = [
        'name',
        'email',
        'password',
        'store_name',
        'description'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
