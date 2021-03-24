<?php

namespace App\Http\Controllers;

use App\Jobs\CustomerCollector;
use App\Jobs\OrderCollector;
use App\Jobs\ProductCollector;
use Illuminate\Http\Request;
use App\Service\CustomerManager;
use App\Models\Shop;
use App\Models\ShopPreviewDescription;
use App\Service\Api;
use App\Service\AssetManager;
use \PHPShopify\AuthHelper;
use \PHPShopify\ShopifySDK;
use Illuminate\Support\Facades\Redirect;
use App\Service\ProductManager;
use App\Events\ProductUploadedToDb;
use Spatie\Async\Pool;
use App\Models\Meta;

class HomeController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }


    public function index(Request $request)
    {
        $hmac =  $request->get('hmac');
        if (isset($hmac)) {

            $myShopifyDomain =  $request->get('shop');
            $timestamp =  $request->get('timestamp');

            $shop = $this->shopModel->getOrCreateShopByMyshopifydomain($myShopifyDomain);

            $config = array(
                'ShopUrl' => $myShopifyDomain,
                'ApiKey' => $this->shopifyApiKey,
                'SharedSecret' => $this->shopifyApiSecret,
            );
            ShopifySDK::config($config);

            //verify if the request came form shopify....
            if (AuthHelper::verifyShopifyRequest()) {
                $statusCheck = $this->apiService->getShopStatus($shop->my_shopify_domain, $shop->access_token);
                $deStatus = json_decode($statusCheck);
                if (!isset($deStatus->shop->id)) {
                    $this->shopModel->changeStatus('uninstall', $shop->my_shopify_domain);
                }
                if ($shop->status == 'new' || $shop->status == 'uninstall') {
                    //shop isn't installed , so we need to redirect it to installation page.. 
                    $redirectUri = config('shopify.SHOPIFY_APP_URL') . "/shopify/auth/callback";

                    $scopes = "write_themes,write_products,write_orders,write_themes,write_customers";

                    $oauthUrl = "https://$myShopifyDomain/admin/oauth/authorize?"
                        . "client_id={$this->shopifyApiKey}"
                        . "&scope={$scopes}"
                        . "&redirect_uri={$redirectUri}"
                        . "&state={$shop->state_token}";

                    return Redirect::to($oauthUrl);
                } elseif ($shop->status == 'installed') {
                    //shop is installed so redirect it to embedded section.......
                    $stateToken = $shop->state_token;
                    $allProductUpload = $this->allUploaded($shop);;
                    $shop = $myShopifyDomain;
                    
                    return view('home', compact(['shop', 'stateToken', 'allProductUpload']));
                }
            }
        }
    }

    public function callback(Request $request)
    {
        $myShopifyDomain = $request->get('shop');
        $code = $request->get('code');
        $state = $request->get('state');

        if (!$this->isValidRequest($_GET)) {
            return "un-authorized request";
        }
        $shop = $this->shopModel->getOrCreateShopByMyshopifydomain($myShopifyDomain);
        if (preg_match($this->UrlPattern, $myShopifyDomain)) {
            if ($shop->state_token != $state) {
                return "Not Authorized";
            }

            $accessTokenResult = json_decode($this->apiService->getAccesToken($code, $this->shopifyApiKey, $this->shopifyApiSecret, $myShopifyDomain), true);
            $accessToken = $accessTokenResult['access_token'];

            //shop details with graphql.............
            $shopDetailsString = $this->apiService->getShopDetails($myShopifyDomain, $accessToken);
            $jsonResultDecoded = json_decode($shopDetailsString); /// decoding result got from graphql api..

            $shopName = $jsonResultDecoded->data->shop->name;
            $url = $jsonResultDecoded->data->shop->url;
            $myshopifyDomain = $jsonResultDecoded->data->shop->myshopifyDomain;
            $this->shopModel->saveDetails($shopName, $url, $shopDetailsString, $shop->id, $accessToken); /// saving store details in db.

            //webhook addresses ...................................................
            $uninstallationHookAddress = config('shopify.SHOPIFY_APP_URL') . "/uninstall";
            $productCreateHookAddress = config('shopify.SHOPIFY_APP_URL') . "/shopify-product-create";
            $productUpdateHookAddress = config('shopify.SHOPIFY_APP_URL') . "/shopify-product-update";
            $productDeleteHookAddress = config('shopify.SHOPIFY_APP_URL') . "/shopify-product-delete";

            $customerDeleteHookAddress = config('shopify.SHOPIFY_APP_URL') . "/shopify-customer-delete";
            $customerCreateHookAddress = config('shopify.SHOPIFY_APP_URL') . "/shopify-customer-create";
            $customerUpdateHookAddress = config('shopify.SHOPIFY_APP_URL') . "/shopify-customer-update";

            $orderDeleteHookAddress = config('shopify.SHOPIFY_APP_URL') . "/shopify-order-delete";
            $orderCreateHookAddress = config('shopify.SHOPIFY_APP_URL') . "/shopify-order-create";
            $orderUpdateHookAddress = config('shopify.SHOPIFY_APP_URL') . "/shopify-order-update";

            $themePublishHookAddress = config('shopify.SHOPIFY_APP_URL') . "/shopify-theme-publish";
            //.................................................................................

            //created webhooks by a common function, passing webhook address and webhook topic...........
            $this->apiService->createWhook($myshopifyDomain, $accessToken, $uninstallationHookAddress, "app/uninstalled");
            $this->apiService->createWhook($myshopifyDomain, $accessToken, $productCreateHookAddress, "products/create");
            $this->apiService->createWhook($myshopifyDomain, $accessToken, $productUpdateHookAddress, "products/update");
            $this->apiService->createWhook($myshopifyDomain, $accessToken, $productDeleteHookAddress, "products/delete");

            $this->apiService->createWhook($myshopifyDomain, $accessToken, $customerCreateHookAddress, "customers/create");
            $this->apiService->createWhook($myshopifyDomain, $accessToken, $customerUpdateHookAddress, "customers/update");
            $this->apiService->createWhook($myshopifyDomain, $accessToken, $customerDeleteHookAddress, "customers/delete");

            $this->apiService->createWhook($myshopifyDomain, $accessToken, $orderCreateHookAddress, "orders/create");
            $this->apiService->createWhook($myshopifyDomain, $accessToken, $orderUpdateHookAddress, "orders/updated");
            $this->apiService->createWhook($myshopifyDomain, $accessToken, $orderDeleteHookAddress, "orders/delete");

            $this->apiService->createWhook($myshopifyDomain, $accessToken, $themePublishHookAddress, "themes/publish");

            /// initialization of queue ... in queue we will store order and customer information of store....
            OrderCollector::dispatch($shop)
                ->delay(now()->addSeconds(5));
            CustomerCollector::dispatch($shop)
                ->delay(now()->addSeconds(6));

            //updating liquid file, it will only update if it's a new store...
            $assetManager = new AssetManager($myshopifyDomain);
            $assetManager->updateProductLiquid();

            ///now let's change the shop status in db.. 
            $this->shopModel->changeStatus('installed', $myshopifyDomain);
            ProductCollector::dispatch($shop)
            ->delay(now()->addSeconds(8));

            $stateToken = $shop->state_token;
            $allProductUpload = $this->allUploaded($shop);
            $shop = $myShopifyDomain;
            return view('home', compact(['shop', 'stateToken', 'allProductUpload']));
        }
    }

    public function uninstall(Request $request)
    {

        $hmac_header = $_SERVER['HTTP_X_SHOPIFY_HMAC_SHA256'];
        $data = file_get_contents('php://input');
        $verified = $this->verify_webhook($data, $hmac_header);
        if ($verified) {
            $shopData = json_decode($data);
            $this->shopModel->uninstall($shopData->domain);
            return response()->json([], 200);
        } else {
            error_log('Webhook verified: ' . var_export($verified, true)); //check error.log to see the result

        }
    }

    public function getEmbedded(Request $request)
    {
        $shop = $request->get('shop');
        $shopDetails = $this->shopModel->getOrCreateShopByMyshopifydomain($shop);
        $statusCheck = $this->apiService->getShopStatus($shopDetails->my_shopify_domain, $shopDetails->access_token);
        $deStatus = json_decode($statusCheck);
        if (!isset($deStatus->shop->id)) {
            $this->shopModel->changeStatus('uninstall', $shopDetails->my_shopify_domain);
        }
        $stateToken = $shopDetails->state_token;
        $allProductUpload = $this->allUploaded($shop);
        //$this->allUploaded($shop);
      
        return view('home', compact(['shop', 'stateToken', 'allProductUpload']));
    }

    public function welcome()
    {
        return view('welcome');
    }

    public function makeOauth(Request $request)
    {
        $request->validate([
            'shop' => 'required|string'
        ]);
        $myShopifyDomain = $this->remove_http($request->get('shop'));
        $myShopifyDomain = $myShopifyDomain. ".myshopify.com";

        $shop = $this->shopModel->getOrCreateShopByMyshopifydomain($myShopifyDomain);

        $statusCheck = $this->apiService->getShopStatus($shop->my_shopify_domain, $shop->access_token);
        $deStatus = json_decode($statusCheck);
        if (!isset($deStatus->shop->id)) {
            $this->shopModel->changeStatus('uninstall', $shop->my_shopify_domain);
        }
        if ($shop->status == 'new' || $shop->status == 'uninstall') {
            //shop isn't installed , so we need to redirect it to installation page.. 
            $redirectUri = config('shopify.SHOPIFY_APP_URL') . "/shopify/auth/callback";

            $scopes = "write_themes,write_products,write_orders,write_themes,write_customers";

            $oauthUrl = "https://$myShopifyDomain/admin/oauth/authorize?"
                . "client_id={$this->shopifyApiKey}"
                . "&scope={$scopes}"
                . "&redirect_uri={$redirectUri}"
                . "&state={$shop->state_token}";

            return $oauthUrl;
        }
        return "installed";
    }

    function remove_http($url) {
        $disallowed = array('http://', 'https://');
        foreach($disallowed as $d) {
           if(strpos($url, $d) === 0) {
              return str_replace($d, '', $url);
           }
        }
        return $url;
     }

    public function getShopSettings($myShopifyDomain)
    {
        $shop = $this->shopModel->getOrCreateShopByMyshopifydomain($myShopifyDomain);
        return [
            'tone' => $shop->tone,
            'industry' => $shop->industry
        ];
    }


    public function themeUpdate(Request $request)
    {
        if ($this->weebhookProcess($request)) {
            $output = new \Symfony\Component\Console\Output\ConsoleOutput();
            $output->writeln($this->data);
            $assetManager = new AssetManager($this->shop);
            $assetManager->updateProductLiquid();
            return response()->json([], 200);
        }
    }

    public function getShopDamiDescription($myShopifyDomain)
    {
        return ShopPreviewDescription::where('my_shopify_domain', $myShopifyDomain)->first();
    }

    public function allUploaded($myShopifyDomain)
    {
        $meta = Meta::where('my_shopify_domain', $myShopifyDomain)->first();
        if($meta !=null){
            if($meta->initial_total_product == $meta->current_importing){
                $shop = Shop::where('my_shopify_domain', $myShopifyDomain)->first();
                $shop->all_product_uploaded  = 1 ;
                $shop->save();
                return 1;
            }

        }
        return 0;
        
    }


    public function test()
    {
        // $shop = Shop::where('my_shopify_domain', 'copy-ai-dev.myshopify.com')->first();
        // $shop->all_product_uploaded  = 1 ;
        // $shop->save();

        //broadcast(new ProductUploadedToDb('am', 599));
        $shop = $this->apiService->getShopByMyDomain('copy-ai-dev.myshopify.com');
       ProductCollector::dispatch($shop)
               ->delay(now()->addSeconds(6));
        // return $this->apiService->getOpenedOrders('copy-ai-dev.myshopify.com', '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');
        // $status = json_decode($status);
        // return isset($status->shop->id);
    }
}
