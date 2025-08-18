<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\PayWayService;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request as GuzzleRequest;
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
        $payment_option = 'abapay_khqr';
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
            'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/transaction-detail',
            $headers,
            $body
        );

        $res    = $client->send($guzzleRequest);
        $result = json_decode((string) $res->getBody(), true); // decode JSON

        // Save response into transaction_detail (json column)
        $order->update([
            'transaction_detail' => $result,
            'payment_status' => $result['data']['payment_status'],
        ]);

        return response()->json([
            'message'   => 'Success',
            'tran_id'   => $tran_id,
            'status'    => $result['status']['message'] ?? null,
            'response'  => $result, // optional: return full payload
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
        // $order = Order::where('tran_id', $request->tran_id)->firstOrFail();

        // $order->update([
        //     'notes' => json_encode($request->all(), JSON_UNESCAPED_UNICODE),
        // ]);

        return response()->json([
            'message' => 'Success',
            'request' => $request->all(),

        ]);
    }
}
