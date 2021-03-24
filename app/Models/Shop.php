<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;
use App\Traits\ShopManager;

class Shop extends Model
{
    use ShopManager;
    protected $connection = 'mongodb';

}
