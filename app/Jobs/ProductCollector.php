<?php

namespace App\Jobs;

use App\Models\Shop;
use Illuminate\Bus\Queueable;
use App\Service\Api as ApiService;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Service\ProductManager;

class ProductCollector implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $shop;

    public function __construct(Shop $shop)
    {
       $this->shop = $shop;
    }


    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $apiService = new ApiService();
        $productManager = new ProductManager($this->shop->my_shopify_domain);
        $productsFromShopify = $apiService->getProduct($this->shop->my_shopify_domain, $this->shop->access_token);
        $productsFromShopify = ($productsFromShopify);
        $productManager->multipleUpload($productsFromShopify);
    }
}
