<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model;

class SampleCopy extends Model
{
    public $timestamps = false;
    protected $connection = 'mongodb';
    protected $fillable = ['format', 'industry', 'description', 'tone'];
    use HasFactory;
}
