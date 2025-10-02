<?php

namespace App\Jobs;

use App\Models\QueueJob;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use App\Http\Controllers\ABAPayoutController;
use Illuminate\Http\Request;

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
        if ($this->queueJob->status == 'completed') return;

        $this->queueJob->update([
            'status' => 'running',
            'run_at' => now(),
        ]);

        try {
            $payload  = $this->queueJob->payload;
            $order_id = $payload['order_id'] ?? null;

            if ($this->queueJob->job_type === 'payout_to_shop' && $order_id) {
                // Call your payout endpoint (internal API)
                // $client = new \GuzzleHttp\Client();

                // $response = $client->post(
                //     url("/api/orders/{$order_id}/payout"), // internal endpoint
                //     [
                //         'headers' => ['Accept' => 'application/json'],
                //         'timeout' => 60,
                //     ]
                // );

                // Call the payout method directly
                $controller = app(ABAPayoutController::class);
                $response = $controller->payout($order_id);

                $statusCode = $response->getStatusCode();
                $result     = json_decode((string) $response->getBody(), true);

                if ($statusCode === 200 && ($result['success'] ?? false)) {
                    // ✅ Mark as completed
                    $this->queueJob->update([
                        'status'       => 'completed',
                        'completed_at' => now(),
                        'note'         => "Payout done for order {$order_id}",
                    ]);
                    return;
                } else {
                    throw new \Exception("Payout failed: " . json_encode($result));
                }
            }

            // If no matching type or order_id missing
            throw new \Exception("Unsupported job type or missing order_id.");
        } catch (\Throwable $e) {
            // ❌ Mark as failed
            $this->queueJob->update([
                'status' => 'failed',
                'note'   => $e->getMessage(),
            ]);
        }
    }
}
