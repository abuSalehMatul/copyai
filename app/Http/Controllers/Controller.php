<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

use App\Models\Shop;
use App\Service\Api;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function __construct()
    {
        //injecting common dependencies and app related variables..
        $this->shopModel = new Shop();
        $this->apiService = new Api();
        $this->shopifyApiKey = config('shopify.SHOPIFY_APP_KEY');
        $this->shopifyApiSecret = config('shopify.SHOPIFY_APP_SECRET');
        $this->UrlPattern = "/[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com[\/]?/";
    }

    protected function weebhookProcess($request)
    {
        //webhook verification and processing ........
        $this->hmac_header = $_SERVER['HTTP_X_SHOPIFY_HMAC_SHA256'];
        $this->data = file_get_contents('php://input');
        $verified = $this->verify_webhook($this->data, $this->hmac_header);
        $this->shop = $request->header('X-Shopify-Shop-Domain');
        return $verified;
    }

    protected function verify_webhook($data, $hmac_header)
    {
        $calculated_hmac = base64_encode(hash_hmac('sha256', $data, $this->shopifyApiSecret, true));
        return hash_equals($hmac_header, $calculated_hmac);
    }

    protected function isValidRequest($query)
    {
        //validating request by the process stated with shopify
        $expectedHmac = $query['hmac'] ?? '';
        unset($query['hmac'], $query['signature']);
        ksort($query);
        $pairs = [];
        foreach ($query as $key => $value) {
            $key = strtr($key, ['&' => '%26', '%' => '%25', '=' => '%3D']);
            $value = strtr($value, ['&' => '%26', '%' => '%25']);
            $pairs[] = $key . '=' . $value;
        }
        $key = implode('&', $pairs);
        return (hash_equals($expectedHmac, hash_hmac('sha256', $key, $this->shopifyApiSecret)));
    }
}
