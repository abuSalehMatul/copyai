<?php

namespace App\Http\Controllers;

use App\Models\SampleCopy;
use Illuminate\Http\Request;
use Laravel\Ui\Presets\React;

class ShopController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function findDefaultsTone($myShopifyDomain)
    {
        $shop = $this->shopModel->getShopByMyDomain($myShopifyDomain);
        return $shop->default_tone;
    }

    public function setDefaultTone($myShopifyDomain)
    {
        $shop = $this->shopModel->getShopByMyDomain($myShopifyDomain);
        $shop->default_tone = config('tone.default_tone');
        $shop->save();
        return config('tone.default_tone');
    }

    public function updateSettings($myshopifyDomain, Request $request)
    {
        $request->validate([
            'my_shopify_domain' => 'required',
        ]);
        $tone = $request->tone;
        if(!$request->tone){
            $tone = "friendly";
        }

        $shop = $this->shopModel->getShopByMyDomain($request->my_shopify_domain);
        $shop->default_tone = $tone;
        $shop->industry = $request->industry;
        $shop->default_format = $request->default_format;
        return $shop->save();
    }

    public function getFormats()
    {
        return config("formatOptions");
    }

    public function getIndustries()
    {
        return config("industries");
    }

    public function getDefaultIndustry($myShopifyDomain)
    {
        $shop =  $this->shopModel->getShopByMyDomain($myShopifyDomain);
        return $shop->industry;
    }

    public function defaultFormat($myShopifyDomain)
    {
        $shop =  $this->shopModel->getShopByMyDomain($myShopifyDomain);
        return $shop->default_format;
    }

    public function setDefaultFormat(Request $request){
        $shop =  $this->shopModel->getShopByStateToken($request->state_token);
        $shop->default_format = "def";
        return $shop->save();
    }

    public function getSampleCopy(Request $request)
    {
        $sampleCopy = SampleCopy::where('format', $request->format)
        ->first();
        return $sampleCopy->description;
    }
}
