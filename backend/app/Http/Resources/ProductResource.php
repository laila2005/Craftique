<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'stock_quantity' => (int) $this->stock_quantity,
            'image_url' => $this->image_url,
            'status' => $this->status,
            'is_archived' => (bool) $this->is_archived,
            'seller' => $this->whenLoaded('seller'),
            'reviews' => $this->whenLoaded('reviews'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
