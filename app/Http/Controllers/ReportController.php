<?php

namespace App\Http\Controllers;

use App\Models\CartHistory;
use App\Models\Meta;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function saveCartHistory(Request $request)
    {
        $myShopifyDomain = $request->shop;
        $token = $request->token;
        $user = $request->copy_user;
        $userTz = $request->copy_user_tz;
        $productId = $request->copy_product_id;
        $totalPrice = $request->copy_total_price;
        $currency = $request->currency;
        $discount = $request->discount;

        $cartStatistics = CartHistory::where('token', $token)->first();
        if($cartStatistics == null){
            $cartStatistics = new CartHistory();
        }
       
        $cartStatistics->myShopifyDomain = $myShopifyDomain;
        $cartStatistics->token = $token;
        $cartStatistics->userTz = $userTz;
        $cartStatistics->user = $user;
        $cartStatistics->totalPrice = $totalPrice;
        $cartStatistics->productId = $productId;
        $cartStatistics->currency = $currency;
        $cartStatistics->discount = $discount;
        return $cartStatistics->save();
    }

    public function getMeta($stateToken)
    {
        $shop = $this->shopModel->getShopByStateToken($stateToken);
        return Meta::where('my_shopify_domain', $shop->my_shopify_domain)->first();
    }
}
