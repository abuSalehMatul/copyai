<?php

namespace App\Service;

use App\Models\Shop;
use App\Traits\ShopManager;
use Carbon\Carbon;

class Api
{
  use ShopManager;

  //// get description from copy.ai service .... 
  public function getDescription($currentDescription, $currentTitle, $format, $tone, $industry)
  {
    if($tone == "") $tone = "friendly";
    $data = [
      'name' => $currentTitle,
      'description' => $currentDescription,
      'tone' => $tone,
      "format" => $format,
      "industry" => $industry
    ];
    $data = json_encode($data);
    $url = "https://us-central1-copyai.cloudfunctions.net/generateShopifyPD";
    $crl = curl_init();
    curl_setopt($crl, CURLOPT_URL, $url);
    curl_setopt($crl, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($crl, CURLOPT_VERBOSE, 0);
    curl_setopt($crl, CURLOPT_HEADER, 1);
    curl_setopt($crl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($crl, CURLOPT_POSTFIELDS, $data);
    curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($crl);
    $header_size = curl_getinfo($crl, CURLINFO_HEADER_SIZE);
    $header = substr($response, 0, $header_size);
    $body = substr($response, $header_size);
    curl_close($crl);
    return $body;
  }


  //update product description in shopify through shopify admin api................
  public function updateProductDescription(Shop $shop, $productId, $description)
  {
    $data = [
      "product" => [
        "id" => $productId,
        "body_html" => $description
      ]
    ];

    $data = json_encode($data);

    $url = "https://{$shop->my_shopify_domain}/admin/api/2021-01/products/{$productId}.json";
    $token = $shop->access_token;
    $crl = curl_init();
    curl_setopt($crl, CURLOPT_URL, $url);
    curl_setopt($crl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'X-Shopify-Access-Token: ' . $token));
    curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($crl, CURLOPT_VERBOSE, 0);
    curl_setopt($crl, CURLOPT_HEADER, 1);
    curl_setopt($crl, CURLOPT_CUSTOMREQUEST, "PUT");
    curl_setopt($crl, CURLOPT_POSTFIELDS, $data);
    curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($crl);
    $header_size = curl_getinfo($crl, CURLINFO_HEADER_SIZE);
    $header = substr($response, 0, $header_size);
    $body = substr($response, $header_size);
    curl_close($crl);
    return $body;
  }


  //get orders .. orders are fetching with order api with pagination. where 
  // each page contain 250 order, and we itterate untill the last page.....
  // we will concatinate a page data with it's next pages's data. and in the end we 
  //will format it in a array
  public function getOpenedOrders($shop, $token)
  {
    $nextPage = '';
    $finalArr = '';
    $lastPage = false;
    $result = "";
    for ($i = 0;; $i++) {
      if ($lastPage == 1) break;
      $items_per_page = 250;

      $url = "https://{$shop}/admin/api/2020-10/orders.json?limit=" . $items_per_page . '&page_info=' . $nextPage;

      $curl = curl_init();
      curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
      curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'X-Shopify-Access-Token:' . $token));
      curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($curl, CURLOPT_URL, $url);
      curl_setopt($curl, CURLOPT_HEADERFUNCTION, function ($curl, $header) use (&$headers) {
        $len = strlen($header);
        $header = explode(':', $header, 2);
        if (count($header) >= 2) {
          $headers[strtolower(trim($header[0]))] = trim($header[1]);
        }
        return $len;
      });
      $response = curl_exec($curl);
      curl_close($curl);
      if (isset($headers['link'])) { // previous and next page info are available in header
        $links = explode(',', $headers['link']);
        foreach ($links as $link) {
          if (strpos($link, 'rel="next"')) {
            preg_match('~<(.*?)>~', $link, $next);
            $url_components = parse_url($next[1]);
            parse_str($url_components['query'], $params);
            $nextPage =  $params['page_info'];
            if ($nextPage == "") { /// if there is no next page
              $lastPage = 1;
              break;
            }
          } else {
            $lastPage = 1;
          }
        }
      } else {
        $lastPage = 1;
        $nextPage = ""; // if missing "link" parameter - there's only one page of results = last_page

      }
       //response is a string, so we will take out only the necessary data, and arrange it in a way so that it product an array
      if ($i > 0) {
        preg_match('/{\"orders\":(.*?)}]}/', $response, $matches);
        if (sizeof($matches) > 1)
          $result = $matches[1] . '}';
        $result = ltrim($result, '[');
      } else {
        // return $response;
        preg_match('/{\"orders\":(.*?)}]}/', $response, $matches);
        if (sizeof($matches) > 1)
          $result = $matches[1] . '}';
      }
      if ($i == 0) {
        $finalArr = $finalArr . $result;
      } else {
        $finalArr = $finalArr . ',' . $result;
      }
    }

    $finalArr = $finalArr . ']'; 

    $OrderManager = new OrderManager($shop);
    if(is_array($finalArr)) $OrderManager->handleMultipleOrder(json_decode($finalArr)); // save order to db...
    return $finalArr;
  }


   //get customers .. customers are fetching with customer api with pagination. where 
  // each page contain 250 customer, and we itterate untill the last page.....
  // we will concatinate a page's data with it's next pages's data. and in the end we 
  //will format it in a array
  public function getCustomers($shop, $token)
  {
    $nextPage = '';
    $finalArr = '';
    $lastPage = false;
    for ($i = 0;; $i++) {
      if ($lastPage == 1) break;
      $items_per_page = 250;

      $url = "https://{$shop}/admin/api/2020-10/customers.json?limit=" . $items_per_page . '&page_info=' . $nextPage;

      $curl = curl_init();
      curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
      curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'X-Shopify-Access-Token:' . $token));
      curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($curl, CURLOPT_URL, $url);
      curl_setopt($curl, CURLOPT_HEADERFUNCTION, function ($curl, $header) use (&$headers) {
        $len = strlen($header);
        $header = explode(':', $header, 2);
        if (count($header) >= 2) {
          $headers[strtolower(trim($header[0]))] = trim($header[1]);
        }
        return $len;
      });
      $response = curl_exec($curl);
      curl_close($curl);
      if (isset($headers['link'])) { // previous and next page info are available in header
        $links = explode(',', $headers['link']);
        foreach ($links as $link) {
          if (strpos($link, 'rel="next"')) {
            preg_match('~<(.*?)>~', $link, $next);
            $url_components = parse_url($next[1]);
            parse_str($url_components['query'], $params);
            $nextPage =  $params['page_info'];
            if ($nextPage == "") {
              $lastPage = 1;
              break;
            }
          } else {
            $lastPage = 1;
          }
        }
      } else {
        $lastPage = 1;
        $nextPage = ""; // if missing "link" parameter - there's only one page of results = last_page

      }
      $result = "";
       //response is a string, so we will take out only the necessary data, and arrange it in a way so that it product an array
      if ($i > 0) {
        preg_match('/{\"customers\":(.*?)}]}/', $response, $matches);
        if (sizeof($matches) > 1) $result = $matches[1] . '}';
        $result = ltrim($result, '[');
      } else {
        preg_match('/{\"customers\":(.*?)}]}/', $response, $matches);
        if (sizeof($matches) > 1)
          $result = $matches[1] . '}';
      }
      if ($i == 0) {
        $finalArr = $finalArr . $result;
      } else {
        $finalArr = $finalArr . ',' . $result;
      }
    }

    $finalArr = $finalArr . ']';

    $customerManager = new CustomerManager($shop);
    if(is_array($finalArr)) $customerManager->handleMultipleCustomer(json_decode($finalArr)); // saving in db
    return $finalArr;
  }


   //get products .. products are fetching with product api with pagination. where 
  // each page contain 250 products, and we itterate untill the last page.....
  // we will concatinate a page's data with it's next pages's data. and in the end we 
  //will format it in a array
  public function getProduct($shop, $token)
  {
    $nextPage = '';
    $finalArr = [];
    $lastPage = false;
    for ($i = 0;; $i++) {
      if ($lastPage == 1) break;
      $items_per_page = 250;

      $url = "https://{$shop}/admin/api/2020-10/products.json?limit=" . $items_per_page . '&page_info=' . $nextPage; // . '&fields=';

      $curl = curl_init();
      curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
      curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'X-Shopify-Access-Token:' . $token));
      curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($curl, CURLOPT_URL, $url);
      curl_setopt($curl, CURLOPT_HEADERFUNCTION, function ($curl, $header) use (&$headers) {
        $len = strlen($header);
        $header = explode(':', $header, 2);
        if (count($header) >= 2) {
          $headers[strtolower(trim($header[0]))] = trim($header[1]);
        }
        return $len;
      });
      $response = curl_exec($curl);
      curl_close($curl);
      if (isset($headers['link'])) { // previous and next page info are available in header
        $links = explode(',', $headers['link']);
        foreach ($links as $link) {
          if (strpos($link, 'rel="next"')) {
            preg_match('~<(.*?)>~', $link, $next);
            $url_components = parse_url($next[1]);
            parse_str($url_components['query'], $params);
            $nextPage =  $params['page_info'];
            if ($nextPage == "") { //if there is no next page
              $lastPage = 1;
              break;
            }
          } else {
            $lastPage = 1;
          }
        }
      } else {
        $lastPage = 1;
        $nextPage = ""; // if missing "link" parameter - there's only one page of results = last_page

      }
      //response is a string, so we will take out only the necessary data, and arrange it in a way so that it product an array
      
      $response = json_decode($response);
      $result = $response->products;
      foreach($result as $val){
        array_push($finalArr, $val);
      }
    }
    return $finalArr ;
  }


  //get shop details with graphql.. 
  function getShopDetails($shop, $access_token)
  {
    $url = "https://{$shop}/admin/api/2019-10/graphql.json";
    $query = json_encode(
      [
        "query" =>
        "{
          shop {
            name
            url
            billingAddress {
              id
              country
              countryCodeV2
              zip
              city
              address1
              province
              phone
            } 
            myshopifyDomain
            timezoneAbbreviation  
            currencyCode
            contactEmail
            email
            description
            primaryDomain {
              url
            }
            plan {
              displayName
            }
          }
        }"
      ]
    );
    $token = $access_token;

    $crl = curl_init();
    curl_setopt($crl, CURLOPT_URL, $url);
    curl_setopt($crl, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'X-Shopify-Access-Token: ' . $token));
    curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($crl, CURLOPT_VERBOSE, 0);
    curl_setopt($crl, CURLOPT_HEADER, 1);
    curl_setopt($crl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($crl, CURLOPT_POSTFIELDS, $query);
    curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($crl);
    $header_size = curl_getinfo($crl, CURLINFO_HEADER_SIZE);
    $header = substr($response, 0, $header_size);
    $body = substr($response, $header_size);
    curl_close($crl);

    return $body;
  }

  //getting access token from shopify oauth endpoint..................
  function getAccesToken($code, $api_key, $secret, $shop)
  {
    $query = array(
      "client_id" => $api_key,
      "client_secret" => $secret,
      "code" => $code
    );
    $url = "https://" . $shop . "/admin/oauth/access_token";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, count($query));
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($query));
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
  }

  //creating webhook through shopify webhook api......
  function createWhook($shop, $accessToken, $address, $topic)
  {
    $url = "https://" . $shop . "/admin/api/2020-04/webhooks.json";
    $address = "\"$address\"";
    $topic = "\"$topic\"";
    $query = '{"webhook": {"topic": ' . $topic . ', "address": ' . $address . ', "format": "json"}}';
    $crl = curl_init();
    curl_setopt($crl, CURLOPT_URL, $url);
    curl_setopt($crl, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "X-Shopify-Access-Token: " . $accessToken));
    curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($crl, CURLOPT_VERBOSE, 0);
    curl_setopt($crl, CURLOPT_HEADER, 1);
    curl_setopt($crl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($crl, CURLOPT_POSTFIELDS, $query);
    curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($crl);
    curl_close($crl);
    return $response;
  }


  //update stores metafield values through shopify admin metafield api... 
  public function updateMetaField($myShopifyDomain, $description, $random)
  {
    $shop = $this->getOrCreateShopByMyshopifydomain($myShopifyDomain);
    $url = "https://" . $myShopifyDomain . "/admin/api/2021-01/metafields.json";
    $metaData = [
      "metafield" => [
        "namespace" => "aivaAiSpec",
        "key" => (string) $random,
        "value" => $description,
        "value_type" => "string"
      ]
    ];
    $data = json_encode($metaData);

    $crl = curl_init();
    curl_setopt($crl, CURLOPT_URL, $url);
    curl_setopt($crl, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "X-Shopify-Access-Token: " . $shop->access_token));
    curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($crl, CURLOPT_VERBOSE, 0);
    curl_setopt($crl, CURLOPT_HEADER, 1);
    curl_setopt($crl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($crl, CURLOPT_POSTFIELDS, $data);
    curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($crl);
    curl_close($crl);
    return $response;
  }

  public function getShopStatus($myShopifyDomain, $accessToken)
  {
    $url = "https://" . $myShopifyDomain . "/admin/api/2021-01/shop.json";

    $crl = curl_init();
    curl_setopt($crl, CURLOPT_URL, $url);
    curl_setopt($crl, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "X-Shopify-Access-Token: " . $accessToken));
    curl_setopt($crl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($crl, CURLOPT_VERBOSE, 0);
    curl_setopt($crl, CURLOPT_HEADER, 1);
    curl_setopt($crl, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($crl, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($crl);
    $header_size = curl_getinfo($crl, CURLINFO_HEADER_SIZE);
    $header = substr($response, 0, $header_size);
    $body = substr($response, $header_size);
    curl_close($crl);
    return $body;
  }
}
