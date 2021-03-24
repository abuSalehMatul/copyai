<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model;

class Variable extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $table = 'variables';
    protected $fillable = ['my_shopify_domain', 'product_id', 'title', 'description', 'occurrence'];

}
