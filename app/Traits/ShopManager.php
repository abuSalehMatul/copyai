<?php

namespace App\Traits;

use App\Models\Shop;

trait ShopManager
{

    ///  GET shop by it's attributes, (state_token, my_shopify_domain)

    public function getShopByStateToken(string $stateToken):Shop
    {
        return Shop::where('state_token', $stateToken)->first();
    }

    public function getShopByMyDomain($myShopifyDomain)
    {
        return Shop::where('my_shopify_domain', $myShopifyDomain)->first();
    }

    public function getOrCreateShopByMyshopifydomain($myshopifydomain)
    {
        $shop= $this->getShopByMyDomain($myshopifydomain);
        if($shop){
            return $shop;
        }
        return $this->createShop($myshopifydomain, 'new');
    }

    //. ..............................................
    

    //create and store details of stores
    public function createShop($myshopifydomain, $status)
    {
        $shop = new Shop;
        $shop->my_shopify_domain = $myshopifydomain;
        $shop->status = $status;
        $shop->access_token = "";
        $shop->state_token = rand(100, 23456) . time();
        $shop->default_tone = "friendly";
        $shop->default_format = "def";
        $shop->industry = "baby_care_products";
        $shop->all_product_uploaded = 0;
        $shop->save();
        return $shop;
    }

    public function saveDetails($shopName, $url, $details, $shopId, $accessToken)
    {
        $shop = Shop::findOrFail($shopId);
        $shop->shop_details_json = $details;
        $shop->shop_url = $url;
        $shop->name = $shopName;
        $shop->access_token = $accessToken;
        $shop->save();
    }

    //...............................................

    public function changeStatus($status, $myShopifyDomain)
    {
        return Shop::where('my_shopify_domain', $myShopifyDomain)->update(['status' => $status]);
    }
   
    public function uninstall($myshopifydomain)
    {
        $shop = Shop::where('my_shopify_domain', $myshopifydomain)->first();
        $shop->status = "uninstall";
        $shop->save();
    }

}

