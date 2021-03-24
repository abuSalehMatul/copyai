<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $connection = 'mongodb';

    protected $fillable = [
        'product_id',
        'title',
        'body_html',
        'vendor',
        'type',
        'handle',
        'published_scope',
        'tags',
        'variants',
        'status',
        'created_at',
        'updated_at',
        'published_at',
        'image',
        'options',
        'my_shopify_domain'
    ];

    public function variables()
    {
        return $this->hasMany(Variable::class, 'product_id', 'product_id');
    }
}
