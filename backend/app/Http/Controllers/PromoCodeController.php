<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PromoCodeController extends Controller
{
    public function validateCode(Request $request)
    {
        $request->validate(['code' => 'required|string']);
        
        $promo = \App\Models\PromoCode::where('code', strtoupper($request->code))
                          ->where('is_active', true)
                          ->first();

        if (!$promo) {
            return response()->json(['message' => 'Invalid or expired promo code.'], 404);
        }

        return response()->json([
            'message' => 'Promo code applied!',
            'discount_percentage' => $promo->discount_percentage
        ]);
    }
}
