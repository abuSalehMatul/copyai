<?php

namespace App\Service;

use App\Models\Product;
use App\Models\Meta;
use App\Events\ProductUploadedToDb;
use App\Models\Shop;
use Illuminate\Support\Facades\Session;

//save, update, delete product in our db..
class ProductManager{

    public function __construct($myShopifyDomain)
    {
        $this->myShopifyDomain = $myShopifyDomain;
    }

    public function setOptimizingFlagOn($productId)
    {
        $product = Product::where('my_shopify_domain', $this->myShopifyDomain)
        ->where('product_id', $productId)->first();
     
        $product->optimized = 1;
        $product->save();
    }

    public function checkProductExistance($handle)
    {
        return Product::where('handle', $handle)
        ->where('my_shopify_domain', $this->myShopifyDomain)
        ->count();
    }

    public function updateProduct($product, $handle)
    {
        return Product::where('my_shopify_domain', $this->myShopifyDomain)
        ->where('handle', $handle)
        ->update($product);
    }

    public function deleteProduct($id)
    {
        return Product::where('product_id', $id)->delete();
    }

    public function saveProduct($product)
    {
        $product['my_shopify_domain'] = $this->myShopifyDomain;
        return Product::create($product);
    }

    public function buildProductData($product)
    {
        return [
            'product_id' => $product->id,
            'title' => $product->title,
            'body_html' => $product->body_html,
            'vendor' => $product->vendor,
            'type' => $product->product_type,
            'handle' => $product->handle,
            'published_scope' => $product->published_scope,
            'tags' => $product->tags,
            'variants' => $product->variants,
            'status' => $product->status,
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
            'published_at' => $product->published_at,
            'image' => $product->image,
            'options' => $product->options,
           
        ];
    }

    public function multipleUpload(array $products)
    {
        $totalProducts = sizeof($products);
        $i = 0;
        $startingTime = time();
        foreach($products as $product){
            $prod = $this->buildProductData($product);
            if($this->checkProductExistance($product->handle) > 0){
                $this->updateProduct($prod, $product->handle);
            }else{
                $this->saveProduct($prod);
            }
            $i++;
            $timeTaken = $this->calculateTimeDifference($startingTime, time());
            $remainingTime = $this->calculateRemainingTime($i, $totalProducts, $timeTaken);
            $this->saveToMeta($totalProducts,  $startingTime, $remainingTime, $i);
            //broadcast(new ProductUploadedToDb($i, $totalProducts, $this->myShopifyDomain, $remainingTime));
        }
    }

    public function saveToMeta($totalProduct, $startingTime, $remainingTime, $currentImporting)
    {
        $meta = Meta::where('my_shopify_domain', $this->myShopifyDomain)->first();
        if($meta == null){
            $meta = new Meta();
            $meta->my_shopify_domain = $this->myShopifyDomain;
        }
        $meta->initial_total_product = $totalProduct;
        $meta->initial_product_import_start_time = $startingTime;
        $meta->initial_product_import_last_time = time();
        $meta->initial_product_import_remaining_time = $remainingTime;
        $meta->current_importing = $currentImporting;
        $meta->save();

    }

    public function calculateTimeDifference($first, $second)
    {
        return $second - $first;
    }

    public function calculateRemainingTime($numDone, $total, $timeTaken)
    {
        if($numDone == $total) {return 0;};

        $remaining = $total - $numDone;
        $totalTimeNeed =  ($timeTaken/$numDone)*$remaining;
        return $totalTimeNeed;
    }


    public function saveBodyHtml($productId, $bodyHtml)
    {
        return Product::where('product_id', $productId)
        ->update(['body_html' => $bodyHtml]);
    }
}