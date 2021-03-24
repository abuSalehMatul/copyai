<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ShopPreviewDescription;
use App\Models\Variable;
use Illuminate\Http\Request;
use App\Service\ProductManager;

class ProductController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function updateDescription($myshopifyDomain, Request $request)
    {
        $request->validate([
            'product_id' => 'required',
        ]);
        $shop = $this->shopModel->getOrCreateShopByMyshopifydomain($myshopifyDomain);
        $this->apiService->updateProductDescription($shop, $request->product_id, $request->description);
        $productManager = new ProductManager($myshopifyDomain);
        $productManager->setOptimizingFlagOn($request->product_id);
        $productManager->saveBodyHtml($request->product_id, $request->description);
        return ShopPreviewDescription::storeDescription($myshopifyDomain, $request->description);
    }

    public function getDescription($myshopifyDomain, Request $request)
    {
        $request->validate([
            'current_description' => 'required',
            'my_shopify_domain' => "required",
            'current_title' => 'required'
        ]);
        $shop = $this->shopModel->getOrCreateShopByMyshopifydomain($request->my_shopify_domain);
        return $this->apiService->getDescription(
            $request->current_description,
            $request->current_title,
            $request->format,
            $request->tone,
            $request->industry
        );
    }

    public function get($myshopifyDomain, Request $request)
    {

        //filter requst processing..........
        $query = $request->get('query');
        $vendor = $request->get('vendor');
        $taggedWith = $request->get('tagged_with');
        $sortBy = $request->get('sory_by');
        $orderBy = $this->getSortByData($sortBy);
        $statuses = $request->get('statuses');
        $type = $request->get('type');

        return Product::where('my_shopify_domain', $myshopifyDomain)
            ->where(function ($q) use ($query) {
                if ($query != null) {
                    $q->where('title', 'like', '%' . $query . '%');
                }
            })
            ->where(function ($q) use ($vendor) {
                if ($vendor != null) {
                    $q->where('vendor', $vendor);
                }
            })
            ->where(function ($q) use ($taggedWith) {
                if ($taggedWith != null) {
                    $q->whereNotNull('tags')
                        ->where('tags', 'like', '%' . $taggedWith . '%');
                }
            })
            ->where(function ($q) use ($statuses) {
                if ($statuses != null) {
                    $statusesArr = explode(',', $statuses);
                    $q->whereIn('status', $statusesArr);
                }
            })
            ->where(function ($q) use ($type) {
                if ($type != null) {
                    $q->where('type', $type);
                }
            })
            ->orderBy($orderBy[1], $orderBy[0])->paginate(50);
    }

    private function getSortByData($sortByKey)
    {
        $order = "ASC";
        $sortBy = "title";
        if ($sortByKey == "by_title_asc") {
            $order = "ASC";
            $sortBy = "title";
        }
        if ($sortByKey == "by_title_desc") {
            $order = "DESC";
            $sortBy = "title";
        }
        if ($sortByKey == "by_type_asc") {
            $order = "ASC";
            $sortBy = "type";
        }
        if ($sortByKey == "by_type_desc") {
            $order = "DESC";
            $sortBy = "type";
        }
        if ($sortByKey == "by_vendor_asc") {
            $order = "ASC";
            $sortBy = "vendor";
        }
        if ($sortByKey == "by_vendor_desc") {
            $order = "DESC";
            $sortBy = "vendor";
        }
        if ($sortByKey == "by_created_asc") {
            $order = "ASC";
            $sortBy = "created_at";
        }
        if ($sortByKey == "by_created_desc") {
            $order = "DESC";
            $sortBy = "created_at";
        }
        return [
            $order, $sortBy
        ];
    }


    public function getFilterData($myshopifyDomain)
    {
        $products =  Product::where('my_shopify_domain', $myshopifyDomain)->get();
        $byVendors = $products->groupBy('vendor');
        $vendorArr = [];
        foreach ($byVendors as $vendor => $value) {
            array_push($vendorArr, $vendor);
        }
        $byType = $products->groupBy('type');
        $typeArr = [];
        foreach ($byType as $type => $value) {
            array_push($typeArr, $type);
        }

        return [
            'vendors' => $vendorArr,
            'types' => $typeArr
        ];
    }

    public function create(Request $request)
    {
        if ($this->weebhookProcess($request)) {
            $productData = json_decode($this->data);
            $productManager = new ProductManager($this->shop);
            $productManager->saveProduct($productManager->buildProductData($productData));

            return response()->json([], 200);
        }
    }

    public function delete(Request $request)
    {
        if ($this->weebhookProcess($request)) {
            $productData = json_decode($this->data);
            $productManager = new ProductManager($this->shop);
            $productManager->deleteProduct($productData->id);

            return response()->json([], 200);
        }
    }

    public function update(Request $request)
    {
       
        if ($this->weebhookProcess($request)) {
             $output = new \Symfony\Component\Console\Output\ConsoleOutput();
             $output->writeln(json_encode($this->data));
            $productData = json_decode($this->data);
            $productManager = new ProductManager($this->shop);
            $productManager->updateProduct($productManager->buildProductData($productData), $productData->handle);

            return response()->json([], 200);
        }
    }

    public function updateMeta($shop, Request $request)
    {
        $request->validate([
            'product_id' => 'required',
            'my_shopify_domain' => 'required'
        ]);
        return ShopPreviewDescription::storeDescription($request->my_shopify_domain, $request->description);
        //return $this->apiService->updateMetaField($request->my_shopify_domain, $request->description, $request->random);
    }

    public function saveVariants($myshopifyDomain, Request $request)
    {
        $request->validate([
            'my_shopify_domain' => 'required',
            'product_id' => 'required',
            'title' => 'required',
            'description' => 'required'
        ]);
        return Variable::create($request->toArray());
    }

    public function getTotalVariantsCount($productId)
    {
        $productId = (int) $productId;
        return Variable::where('product_id', '=', $productId)->count();
    }

    public function productWithVariants($stateToken)
    {
        $shop = $this->shopModel->getShopByStateToken($stateToken);
        $products = Product::where('my_shopify_domain', $shop->my_shopify_domain)->with('variables')->get();
        return $products;
    }
}
