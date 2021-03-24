<?php


// All routes are available here, naming tries to specify the acition of each routes
use Illuminate\Support\Facades\Route;

Route::get('/', "HomeController@welcome");
Route::get('shop-settings/{myShopifyDomain}', 'HomeController@getShopSettings');
Route::post('update-settings/{myShopifyDomain}', 'ShopController@updateSettings');

//getting the options avaiable (format and industry)..........
Route::get('format-options', "ShopController@getFormats");
Route::get('industry-options', "ShopController@getIndustries")->middleware('cors');
//............................

//GET, SET default values for format, industry, tone
Route::get('get-default-industry/{myShopifyDomain}', "ShopController@getDefaultIndustry");
Route::get('shop-default-format/{myShopifyDomain}', "ShopController@defaultFormat");
Route::post('set-shop-default-format', 'ShopController@setDefaultFormat');
Route::get("shop-tones/{myShopifyDomain}", "ShopController@findDefaultsTone");
Route::get("shop-default-tone/{myShopifyDomain}", "ShopController@setDefaultTone");
//................................

// Base Route, Application starting point
Route::get('/home', 'HomeController@index')->middleware('cors');

//auth callback route............
Route::get('shopify/auth/callback', 'HomeController@callback')->name('redirect_url')->middleware('cors');

// Webhook routes, name specify the action of each route........................
Route::any('uninstall', 'HomeController@uninstall')->name('unistallation_hook');

Route::any('shopify-product-create', 'ProductController@create');
Route::any('shopify-product-update', 'ProductController@update');
Route::any('shopify-product-delete', 'ProductController@delete');

Route::any('shopify-customer-delete', 'CustomerController@delete');
Route::any('shopify-customer-create', 'CustomerController@create');
Route::any('shopify-customer-update', 'CustomerController@update');

Route::any('shopify-order-delete', 'OrderController@delete');
Route::any('shopify-order-create', 'OrderController@create');
Route::any('shopify-order-update', 'OrderController@update');

Route::any('shopify-theme-publish', 'HomeController@themeUpdate');

//end of webhook routes....................................


//GET , SET product description routes
Route::post('update-description/{myShopifyDomain}', 'ProductController@updateDescription');
Route::post('get-description/{myShopifyDomain}', 'ProductController@getDescription');
Route::get('dami-detais/{myShopifyDomain}', 'HomeController@getShopDamiDescription')->middleware('cors');
//.................................

Route::post('update-meta/{myShopifyDomain}', 'ProductController@updateMeta')->middleware('cors');
Route::post('update-variants/{myShopifyDomain}', 'ProductController@saveVariants')->middleware('cors');
Route::get('total-variants-count/{productId}', 'ProductController@getTotalVariantsCount')->middleware('cors');
Route::get('get-product-with-variants/{stateToken}', 'ProductController@productWithVariants')->middleware('cors');

//GET product and it's filters
Route::get('get-products/{myShopifyDomain}', 'ProductController@get');
Route::get('get-filtering-values/{myShopifyDomain}', 'ProductController@getFilterData');

//...........................

Route::post('get-sample-copy', "ShopController@getSampleCopy"); //get sample copies that stored in db


//testing routes...............................
Route::get('test', 'HomeController@test');

Route::get('getEmbedded', 'HomeController@getEmbedded');


//routes from standalone

Route::post('get-oauth', 'HomeController@makeOauth');

//save cart data 
Route::post('save-cart-history', 'ReportController@saveCartHistory')->middleware('cors');

Route::get("get-product-upload-meta/{stateToken}", 'ReportController@getMeta')->middleware('cors');
