<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Service\CustomerManager;
use Illuminate\Http\Request;
use App\Service\ProductManager;

class CustomerController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function delete(Request $request)
    {
        if ($this->weebhookProcess($request)) {
            $customerData = json_decode($this->data);
            $customer = (array) $customerData;
            $customerManager = new CustomerManager($this->shop);
            $customerManager->deleteCustomer($customer);

            return response()->json([], 200);
        }
    }

    public function update(Request $request)
    {
        if ($this->weebhookProcess($request)) {
            $customerData = json_decode($this->data);
            $customer = (array) $customerData;
            $customerManager = new CustomerManager($this->shop);
            $customerManager->updateCustomer($customer);

            return response()->json([], 200);
        } 
    }

    public function create(Request $request)
    {
        if ($this->weebhookProcess($request)) {
            $customerData = json_decode($this->data);
            $customer = (array) $customerData;
            $customerManager = new CustomerManager($this->shop);
            $output = new \Symfony\Component\Console\Output\ConsoleOutput();
            $output->writeln(json_encode($customer));
            $customerManager->saveCustomer($customer);

            return response()->json([], 200);
        }
    }
}