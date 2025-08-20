<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\PayWayService;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request as GuzzleRequest;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ABAPaywayCheckout extends Controller
{

    protected $payWayService;

    public function __construct(PayWayService $payWayService)
    {
        $this->payWayService = $payWayService;
    }

    public function shopping_cart()
    {
        // $item = [
        //     ['name' => 'test1', 'quantity' => '1', 'price' => '10.00'],
        //     ['name' => 'test2', 'quantity' => '1', 'price' => '10.00']
        // ];
        // $transactionId = 'TXN001234567';
        // $amount = '1.00';
        // $firstName = 'Sokha';
        // $lastName = 'Tim';
        // $phone = '093630466';
        // $email = 'sokha.tim@ababank.com'; // or any default payment option if needed
        // $req_time = date('YmdHis');
        // $merchant_id = config('payway.merchant_id');
        // $api_url = config('payway.api_url');
        // $payment_option = 'abapay'; // or any default payment option if needed
        // // $return_params ='payment_success';
        // $hash = $this->payWayService->getHash(
        //     $req_time . $merchant_id . $transactionId . $amount .
        //         $firstName . $lastName . $email . $phone . $payment_option
        // );
        $req_time = date('YmdHis'); // UTC time format
        $merchant_id = config('payway.merchant_id');
        $tran_id = uniqid();
        $amount = '0.01';
        $items = '';
        $shipping = '0';
        $firstname = 'Long';
        $lastname = 'Soeng';
        $email = 'long.soeng@example.com';
        $phone = '012345678';
        $type = 'purchase';
        $payment_option = 'abapay_khqr_deeplink';
        $return_url = 'https://pgmarket.online/aba/callback?tran_id=' . $tran_id;
        $cancel_url = 'https://pgmarket.online/aba/cancel?tran_id=' . $tran_id;
        $continue_success_url = 'https://pgmarket.online/aba/success?tran_id=' . $tran_id;
        $return_deeplink = '';
        $currency = 'USD';
        $custom_fields = '';
        $return_params = '';
        $payout = '';
        $lifetime = '';
        $additional_params = '';
        $google_pay_token = '';
        $skip_success_page = 1;

        $hash_string = $req_time . $merchant_id . $tran_id . $amount . $items . $shipping .
            $firstname . $lastname . $email . $phone . $type . $payment_option .
            $return_url . $cancel_url . $continue_success_url . $return_deeplink .
            $currency . $custom_fields . $return_params . $payout . $lifetime .
            $additional_params . $google_pay_token . $skip_success_page;

        $hash = $this->payWayService->getHash($hash_string);
        // dd($merchant_id);
        return Inertia::render("nokor-tech/cart/ShoppingCart", [
            'req_time' => $req_time,
            'merchant_id' => $merchant_id,
            'tran_id' => $tran_id,
            'amount' => $amount,
            'items' => $items,
            'shipping' => $shipping,
            'firstname' => $firstname,
            'lastname' => $lastname,
            'email' => $email,
            'phone' => $phone,
            'type' => $type,
            'payment_option' => $payment_option,
            'return_url' => $return_url,
            'cancel_url' => $cancel_url,
            'continue_success_url' => $continue_success_url,
            'return_deeplink' => $return_deeplink,
            'currency' => $currency,
            'custom_fields' => $custom_fields,
            'return_params' => $return_params,
            'payout' => $payout,
            'lifetime' => $lifetime,
            'additional_params' => $additional_params,
            'google_pay_token' => $google_pay_token,
            'skip_success_page' => $skip_success_page,
            'hash' => $hash,
            'api_url' => config('payway.api_url'), // Assuming this is defined elsewhere
        ]);
    }
    // End Payment Gateway

    // public function showTestCheckoutForm()
    // {
    //     $item = [
    //         ['name' => 'test1', 'quantity' => '1', 'price' => '10.00'],
    //         ['name' => 'test2', 'quantity' => '1', 'price' => '10.00']
    //     ];
    //     $transactionId = 'TXN001234567';
    //     $amount = '1.00';
    //     $firstName = 'Sokha';
    //     $lastName = 'Tim';
    //     $phone = '093630466';
    //     $email = 'sokha.tim@ababank.com'; // or any default payment option if needed
    //     $req_time = date('YmdHis');
    //     $merchant_id = config('payway.merchant_id');
    //     $payment_option = 'abapay'; // or any default payment option if needed
    //     // $return_params ='payment_success';
    //     $hash = $this->payWayService->getHash(
    //         $req_time . $merchant_id . $transactionId . $amount .
    //             $firstName . $lastName . $email . $phone . $payment_option
    //     );

    //     return view('aba_test_checkout', compact(
    //         'hash',
    //         'transactionId',
    //         'amount',
    //         'firstName',
    //         'lastName',
    //         'phone',
    //         'email',
    //         'payment_option',
    //         'merchant_id',
    //         'req_time'
    //     ));
    // }

    public function callback(Request $request)
    {
        // return $request->all();
        $order = Order::where('tran_id', $request->tran_id)->firstOrFail();

        $req_time   = $order->req_time; // UTC format from DB
        $merchantId = config('payway.merchant_id');
        $tran_id    = $order->tran_id;

        $hashString = $req_time . $merchantId . $tran_id;
        $hash       = $this->payWayService->getHash($hashString);

        $client = new Client();
        $headers = [
            'Content-Type' => 'application/json'
        ];

        $body = json_encode([
            'req_time'    => $req_time,
            'merchant_id' => $merchantId,
            'tran_id'     => $tran_id,
            'hash'        => $hash,
        ]);

        $guzzleRequest = new GuzzleRequest(
            'POST',
            config('payway.base_api_domain') . '/api/payment-gateway/v1/payments/check-transaction-2',
            $headers,
            $body
        );

        try {
            $res    = $client->send($guzzleRequest);
            $result = json_decode((string) $res->getBody(), true);

            $statusCode = $result['status']['code'] ?? null;

            if ($statusCode === '00') {
                $paymentStatus = $result['data']['payment_status'] ?? null;
                $order_status  = $paymentStatus === 'APPROVED' ? 'paid' : 'pending';

                $order->update([
                    'transaction_detail' => $result,
                    'status'            => $order_status,
                    'payment_status'    => $paymentStatus,
                ]);
            } else {
                $order->update([
                    'transaction_detail' => $result,
                ]);

                Log::warning('ABA callback returned error', [
                    'tran_id' => $order->tran_id,
                    'response' => $result,
                ]);

                return response()->json([
                    'tran_id'  => $tran_id,
                    'response' => $result,
                ], 500);
            }
        } catch (\Throwable $e) {
            Log::error('ABA callback failed', [
                'tran_id' => $order->tran_id,
                'error'   => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to process callback',
                'error'   => $e->getMessage(),
            ], 500);
        }

        // Safe final return
        return response()->json([
            'message'  => 'Success',
            'tran_id'  => $tran_id,
            'status'   => $result['status']['message'] ?? null,
            'response' => $result,
        ]);
    }
    public function cancel(Request $request)
    {
        $order = Order::where('tran_id', $request->tran_id)->firstOrFail();
        // Authorization
        if ($request->user()->id != $order->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $order->delete();
        return redirect('/shopping-cart?user_cancel=1');
    }
    public function success(Request $request)
    {
        $order = Order::where('tran_id', $request->tran_id)->first();
        // $order->update([
        //     'notes' => json_encode($request->all(), JSON_UNESCAPED_UNICODE),
        // ]);
        if ($order) {
            return redirect('/shopping-cart?order_success=1&order_id=' . $order->id);
        } else {
            return redirect('/shopping-cart?order_fail=1');
        }

        // return response()->json([
        //     'message' => 'Success',
        //     'request' => $request->all(),
        // ]);
    }
}
