<?php

namespace App\Jobs;

use App\Models\QueueJob;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessQueueJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public QueueJob $queueJob;

    public function __construct(QueueJob $queueJob)
    {
        $this->queueJob = $queueJob;
    }

    public function handle(): void
    {
        // Mark as running
        $this->queueJob->update(['status' => 'running', 'run_at' => now()]);

        try {
            // Simulate Long Time process
            sleep(10);
            // Example: pretend we payout
            $payload = $this->queueJob->payload;

            // Do actual logic here:
            // PayoutService::pay($payload['order_id'], $payload['amount']);

            // Mark as completed
            $this->queueJob->update([
                'status' => 'completed',
                'completed_at' => now(),
                'note' => 'Payout done for order ' . $payload['order_id'],
            ]);
        } catch (\Throwable $e) {
            // Mark as failed
            $this->queueJob->update([
                'status' => 'failed',
                'note' => $e->getMessage(),
            ]);
        }
    }
}
