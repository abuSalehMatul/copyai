<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model;

class ShopPreviewDescription extends Model
{
    use HasFactory;
    protected $connection = 'mongodb';
    protected $fillable = [
        'product_id',
         'description',
        'my_shopify_domain'
    ];


    public static function storeDescription($myShopifyDomain, $description)
    {
        $damiDescription = ShopPreviewDescription::where('my_shopify_domain', $myShopifyDomain)->first();
        if($damiDescription == null){
            $damiDescription = new ShopPreviewDescription();
            $damiDescription->my_shopify_domain = $myShopifyDomain;
        }
        $damiDescription->description = $description;
        return $damiDescription->save();
    }
}
