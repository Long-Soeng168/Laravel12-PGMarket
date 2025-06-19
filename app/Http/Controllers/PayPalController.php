<?php

namespace App\Http\Controllers;

use App\Helpers\TelegramHelper;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class PayPalController extends Controller
{
    /**
     * @noinspection PhpMissingReturnTypeInspection
     */
    public function index()
    {
        // return view('checkout');
        return Inertia::render("nokor-tech/cart/checkout_test");
    }

    /**
     * @return string
     */
    private function getAccessToken(): string
    {
        $headers = [
            'Content-Type'  => 'application/x-www-form-urlencoded',
            'Authorization' => 'Basic ' . base64_encode(config('paypal.client_id') . ':' . config('paypal.client_secret'))
        ];

        $response = Http::withHeaders($headers)
            ->withBody('grant_type=client_credentials')
            ->post(config('paypal.base_url') . '/v1/oauth2/token');

        return json_decode($response->body())->access_token;
    }

    /**
     * @return string
     */
    public function create(Request $request, int $amount): string
    {
        $id = uuid_create();

        $headers = [
            'Content-Type'      => 'application/json',
            'Authorization'     => 'Bearer ' . $this->getAccessToken(),
            'PayPal-Request-Id' => $id,
        ];

        $body = [
            "intent"         => "CAPTURE",
            "purchase_units" => [
                [
                    "reference_id" => $id,
                    "amount"       => [
                        "currency_code" => "USD",
                        "value"         => number_format($amount, 2),
                    ]
                ]
            ]
        ];

        $response = Http::withHeaders($headers)
            ->withBody(json_encode($body))
            ->post(config('paypal.base_url') . '/v2/checkout/orders');

        Session::put('request_id', $id);
        Session::put('order_id', json_decode($response->body())->id);

        return json_decode($response->body())->id;
    }

    /**
     * @return mixed
     */
    public function complete(Request $request)
    {
        $url = config('paypal.base_url') . '/v2/checkout/orders/' . Session::get('order_id') . '/capture';

        $headers = [
            'Content-Type'  => 'application/json',
            'Authorization' => 'Bearer ' . $this->getAccessToken(),
        ];

        $response = Http::withHeaders($headers)->post($url);

        if (!$response->successful()) {
            return response()->json([
                'success' => false,
                'message' => 'Payment capture failed.',
                'paypal_response' => $response->json(),
            ], 400);
        }

        // Validate request after confirming PayPal capture
        $validated = $request->validate([
            'name'       => 'nullable|string|max:255',
            'phone'      => 'nullable|string|max:20',
            'email'      => 'nullable|email|max:255',
            'address'    => 'nullable|string|max:255',
            'note'       => 'nullable|string',
            'total'      => 'required|numeric',
            'items'      => 'required|array',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.price'   => 'required|numeric',
            'items.*.discount' => 'nullable|numeric',
            'items.*.discount_type' => 'nullable|string|in:percentage,fixed',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.total'    => 'required|numeric',
        ]);

        try {
            DB::beginTransaction();

            $order = Order::create([
                'name'    => $validated['name'] ?? null,
                'phone'   => $validated['phone'] ?? '0000',
                'email'   => $validated['email'] ?? null,
                'address' => $validated['address'] ?? null,
                'note'    => $validated['note'] ?? null,
                'total'   => $validated['total'],
            ]);

            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id'      => $order->id,
                    'item_id'       => $item['item_id'],
                    'price'         => $item['price'],
                    'discount'      => $item['discount'] ?? 0,
                    'discount_type' => $item['discount_type'] ?? 'percentage',
                    'quantity'      => $item['quantity'],
                    'total'         => $item['total'],
                ]);
            }

            DB::commit();

            // Optionally send notification
            // TelegramHelper::sendOrderItems($order);

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully!',
                'paypal_capture' => $response->json(),
            ]);
        } catch (\Exception $e) {
            DB::rollback();

            Log::error('Order placement failed after payment capture', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to place order.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
