<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        "uninstall", "shopify-product-create", "shopify-product-update", "shopify-product-delete", "shopify-customer-delete", "update-meta",
        "shopify-customer-update", "shopify-customer-create", "shopify-order-delete", "shopify-order-create", "shopify-order-update", "shopify-theme-publish",
        "save-cart-history"
     ];
}
