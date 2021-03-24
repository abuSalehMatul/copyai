<?php

namespace App\Service;

use App\Models\Order;

// saving order in db accordingly by myshopify domain... 
class OrderManager{
    public function __construct($myShopifyDomain)
    {
        $this->myShopifyDomain = $myShopifyDomain;
    }
    
    public function handleMultipleorder($orders)
    {
        foreach($orders as $order){
            $order = (array) $order;
            $this->saveOrder($order);
        }
    }

    public function saveOrder(array $order)
    {
        $customer['shop'] = $this->myShopifyDomain;
        Order::insert($order);
    }

    public function updateOrder(array $customer)
    {
        $customer['shop'] = $this->myShopifyDomain;
        $this->deleteOrder($customer);
        return $this->saveOrder($customer);
    }

    public function deleteOrder(array $customer)
    {
        Order::where('id', $customer['id'])->delete();
    }
}