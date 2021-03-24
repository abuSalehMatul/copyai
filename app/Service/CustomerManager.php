<?php

namespace App\Service;

use App\Models\Customer;

//saving customer in db by myshopifydomain............
class CustomerManager
{
    public function __construct($myShopifyDomain)
    {
        $this->myShopifyDomain = $myShopifyDomain;
    }
    public function handleMultipleCustomer($customers)
    {
        foreach ($customers as $customer) {
            $customer = (array) $customer;
            $this->saveCustomer($customer);
        }
    }

    public function saveCustomer(array $customer)
    {
        $customer['shop'] = $this->myShopifyDomain;
        return Customer::insert($customer);
    }

    public function updateCustomer(array $customer)
    {
        $customer['shop'] = $this->myShopifyDomain;
        $this->deleteCustomer($customer);
        return $this->saveCustomer($customer);
    }

    public function deleteCustomer(array $customer)
    {
        Customer::where('id', $customer['id'])->delete();
    }
}
