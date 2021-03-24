<?php

namespace App\Http\Controllers;

use App\Service\OrderManager;
use Illuminate\Http\Request;
use App\Service\ProductManager;

class OrderController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function delete(Request $request)
    {
        if ($this->weebhookProcess($request)) {
            $orderData = json_decode($this->data);
            $order = (array) $orderData;
            $orderManager = new OrderManager($this->shop);
            $orderManager->deleteOrder($order);

            return response()->json([], 200);
        }
    }

    public function update(Request $request)
    {
        if ($this->weebhookProcess($request)) {
            $orderData = json_decode($this->data);
            $order = (array) $orderData;
            $orderManager = new OrderManager($this->shop);
            $orderManager->updateOrder($order);

            return response()->json([], 200);
        } 
    }

    public function create(Request $request)
    {
        if ($this->weebhookProcess($request)) {
            $orderData = json_decode($this->data);
            $order = (array) $orderData;
            $orderManager = new OrderManager($this->shop);
            $output = new \Symfony\Component\Console\Output\ConsoleOutput();
            $output->writeln(json_encode($order));
            $orderManager->saveOrder($order);

            return response()->json([], 200);
        }
    }
}