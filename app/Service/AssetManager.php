<?php

namespace App\Service;

use Illuminate\Support\Facades\Storage;
use PhpParser\Node\Expr\FuncCall;
use App\Traits\ShopManager;
use Illuminate\Support\Facades\App;

class AssetManager
{
    use ShopManager;

    public function __construct($myShopifyDomain)
    {
        $this->myShopifyDomain = $myShopifyDomain;
        $this->shop =  $this->getOrCreateShopByMyshopifydomain($myShopifyDomain);
    }


    // gettting the minified js code to inject in product liquid........
    public function getJsCode()
    {
        $first = '{% assign productDescriptionMain = product.description | strip_html | strip_newlines| replace: \'"\',"\'" %}';
        $second = '<script>'. file_get_contents(public_path('minified_dev.js')). '</script>'; 
        if (App::environment('production')) {
            $second = '<script>'. file_get_contents(public_path('minified_prod.js')). '</script>';;
        }
        return $first . $second;
    }


    // have to make sure the liquid is only updated for a store who have status 'new'...
    public function uploadAssetToNewStore()
    {
        // return $this->updateProductLiquid();
        if ($this->shop->status == 'new') {
            return $this->updateProductLiquid();
        }
    }

    public function updateProductLiquid()
    {
        $allAssetsForShop = $this->getAllAsset();
        $mainThemeId = $this->findTheMainThemeId($allAssetsForShop);
        $key = "templates/product.liquid";
        $productLiquid = $this->findSingleAssetByKey($mainThemeId, $key);
        $productLiquidDecoded = json_decode($productLiquid, 1);

        $niddle =  $this->getJsCode();
        if(strpos( $productLiquidDecoded['value'] ,$niddle  ) != false){
            $replace = $this->getJsCode();
            $value = str_replace ( $niddle , $replace , $productLiquidDecoded['value'] ) ;
        }else{
            $value = $productLiquidDecoded['value'] . $this->getJsCode();
        }
        return  $this->updateOrCreate($mainThemeId, $key, $value);
    }


    //finding all available theme

    public function getAllAsset()
    {
        $url = "https://" . $this->myShopifyDomain . '/admin/api/2019-10/themes.json';
        $crl = curl_init();
        curl_setopt($crl, CURLOPT_URL, $url);
        curl_setopt($crl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'X-Shopify-Access-Token: ' . $this->shop->access_token));
        curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($crl, CURLOPT_VERBOSE, 0);
        curl_setopt($crl, CURLOPT_HEADER, 1);
        curl_setopt($crl, CURLOPT_CUSTOMREQUEST, "GET");
        curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($crl);
        curl_close($crl);
        $array = preg_match("/\"themes\":(.*)]}/", $response, $data);
        $themes = $data[1] . ']';
        return json_decode($themes);
    }


    // to update or create any asset in theme file , we will be needing currently activated theme on that store, so getting it. 
    public function findTheMainThemeId($themes)
    {
        foreach ($themes as $theme) {
            if ($theme->role == 'main') {
                return $theme->id;
            }
        }
    }

    //finding assets for a particular theme.............
    public function findThemeAssets($themeId)
    {
        $url = "https://" . $this->shop . '/admin/api/2019-10/themes/' . $themeId . '/assets.json';

        $crl = curl_init();
        curl_setopt($crl, CURLOPT_URL, $url);
        curl_setopt($crl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'X-Shopify-Access-Token: ' . $this->accessToken));
        curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($crl, CURLOPT_VERBOSE, 0);
        curl_setopt($crl, CURLOPT_HEADER, 1);
        curl_setopt($crl, CURLOPT_CUSTOMREQUEST, "GET");
        curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($crl);
        curl_close($crl);
        $array = preg_match("/\"assets\":(.*)]}/", $response, $data);
        $assets = $data[1] . ']';
        return json_decode($assets);
    }

    public function deleteAsset($themeId, $assetKey)
    {
        $url = "https://$this->shop/admin/api/2020-04/themes/$themeId/assets.json?asset[key]=$assetKey";

        $crl = curl_init();
        curl_setopt($crl, CURLOPT_URL, $url);
        curl_setopt($crl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'X-Shopify-Access-Token: ' . $this->accessToken));
        curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($crl, CURLOPT_VERBOSE, 0);
        curl_setopt($crl, CURLOPT_HEADER, 1);
        curl_setopt($crl, CURLOPT_CUSTOMREQUEST, "DELETE");
        curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($crl);
        curl_close($crl);
        return $response;
    }

    /// by an asset key, getting it.. with shopify asset api........
    public function findSingleAssetByKey($themeId, $assetKey)
    {
        $url = "https://$this->myShopifyDomain/admin/api/2020-04/themes/$themeId/assets.json?asset[key]=$assetKey";
        //  print_r($url);
        $crl = curl_init();
        curl_setopt($crl, CURLOPT_URL, $url);
        curl_setopt($crl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'X-Shopify-Access-Token: ' . $this->shop->access_token));
        curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($crl, CURLOPT_VERBOSE, 0);
        curl_setopt($crl, CURLOPT_HEADER, 1);
        curl_setopt($crl, CURLOPT_CUSTOMREQUEST, "GET");
        curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($crl);
        curl_close($crl);
        //  print_r($response);
        if (
            preg_match("/HTTP\/1.1 200/", $response) ||
            preg_match("/HTTP\/2 200/", $response) ||
            preg_match("/HTTP\/1.1 201/", $response) ||
            preg_match("/HTTP\/2 201/", $response)
        ) {
            $array = preg_match("/\"asset\":(.*)}/", $response, $data);
            return $data[1];
        }
    }

    // get a specific version of asset data from it's public url................
    public function fetchDataFromPublicUrl($url)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        return $response;
    }


    /// POST, PUT values in shopify theme assets file .... with shopify asset api..........
    public function updateOrCreate($themeId, $key, $value)
    {
        $url = "https://" . $this->myShopifyDomain . '/admin/api/2020-04/themes/' . $themeId . '/assets.json';
        $data = [
            "asset" => [
                "key" => $key,
                "value" => $value
            ]
        ];
        $data = json_encode($data);
        $crl = curl_init();
        curl_setopt($crl, CURLOPT_URL, $url);
        curl_setopt($crl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'X-Shopify-Access-Token: ' . $this->shop->access_token));
        curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($crl, CURLOPT_VERBOSE, 0);
        curl_setopt($crl, CURLOPT_HEADER, 1);
        curl_setopt($crl, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_setopt($crl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($crl);

        curl_close($crl);
        return $response;
    }

}
