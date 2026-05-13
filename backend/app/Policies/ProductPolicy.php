<?php

namespace App\Policies;

use App\Models\Product;
use Illuminate\Auth\Access\Response;

class ProductPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update($user, Product $product): bool
    {
        return $user->id === $product->seller_id && get_class($user) === 'App\Models\Seller';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete($user, Product $product): bool
    {
        return $user->id === $product->seller_id && get_class($user) === 'App\Models\Seller';
    }
}
