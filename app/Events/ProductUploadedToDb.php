<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductUploadedToDb implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $currentNumUploaded;
    public $total;
    public $shop;
    public $remainingTime;

    public function __construct($currentNumUploaded, $total, $shop, $remainingTime)
    {
        $this->currentNumUploaded = $currentNumUploaded;
        $this->total = $total;
        $this->shop = $shop;
        $this->remainingTime = $remainingTime;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('product-uploaded-to-'.$this->shop);
    }
}
