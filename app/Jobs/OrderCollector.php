<?php

namespace App\Jobs;

use App\Models\Shop;
use App\Service\Api as ApiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class OrderCollector implements ShouldQueue
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
        $apiService->getOpenedOrders($this->shop->my_shopify_domain, $this->shop->access_token);

    }
}
