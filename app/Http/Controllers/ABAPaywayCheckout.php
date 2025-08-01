<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request as GuzzleRequest;
use Inertia\Inertia;

class ABAPaywayCheckout extends Controller
{

    public function abaPaywayCheckout()
    {
        $merchant_id = config('services.aba.merchant_id');
        $public_key = config('services.aba.api_key');

        $req_time = date('YmdHis'); // UTC time format
        $tran_id = 'TXN001234567';
        $amount = '1000';
        $items = '';
        $shipping = '100';
        $firstname = 'Long';
        $lastname = 'Soeng';
        $email = 'long.soeng@example.com';
        $phone = '012345678';
        $type = 'purchase';
        $payment_option = 'cards';
        $return_url = '/aba/callback';
        $cancel_url = '/aba/cancel';
        $continue_success_url = '/aba/success';
        $return_deeplink = '';
        $currency = 'USD';
        $custom_fields = '';
        $return_params = '';
        $payout = '';
        $lifetime = '';
        $additional_params = '';
        $google_pay_token = '';
        $skip_success_page = 'true';

        $hash_string = $req_time . $merchant_id . $tran_id . $amount . $items . $shipping .
            $firstname . $lastname . $email . $phone . $type . $payment_option .
            $return_url . $cancel_url . $continue_success_url . $return_deeplink .
            $currency . $custom_fields . $return_params . $payout . $lifetime .
            $additional_params . $google_pay_token . $skip_success_page;

        $hash = base64_encode(hash_hmac('sha512', $hash_string, $public_key, true));

        $client = new Client();
        $headers = [
            'Content-Type' => 'multipart/form-data'
        ];
        $options = [
            'multipart' => [
                ['name' => 'req_time', 'contents' => $req_time],
                ['name' => 'merchant_id', 'contents' => $merchant_id],
                ['name' => 'tran_id', 'contents' => $tran_id],
                ['name' => 'firstname', 'contents' => $firstname],
                ['name' => 'lastname', 'contents' => $lastname],
                ['name' => 'email', 'contents' => $email],
                ['name' => 'phone', 'contents' => $phone],
                ['name' => 'type', 'contents' => $type],
                ['name' => 'payment_option', 'contents' => $payment_option],
                ['name' => 'items', 'contents' => $items],
                ['name' => 'shipping', 'contents' => $shipping],
                ['name' => 'amount', 'contents' => $amount],
                ['name' => 'currency', 'contents' => $currency],
                ['name' => 'return_url', 'contents' => $return_url],
                ['name' => 'cancel_url', 'contents' => $cancel_url],
                ['name' => 'skip_success_page', 'contents' => $skip_success_page],
                ['name' => 'continue_success_url', 'contents' => $continue_success_url],
                ['name' => 'return_deeplink', 'contents' => $return_deeplink],
                ['name' => 'custom_fields', 'contents' => $custom_fields],
                ['name' => 'return_params', 'contents' => $return_params],
                ['name' => 'view_type', 'contents' => 'hosted_view'],
                ['name' => 'payment_gate', 'contents' => ''],
                ['name' => 'payout', 'contents' => $payout],
                ['name' => 'additional_params', 'contents' => $additional_params],
                ['name' => 'lifetime', 'contents' => $lifetime],
                ['name' => 'google_pay_token', 'contents' => $google_pay_token],
                ['name' => 'hash', 'contents' => $hash],
            ]
        ];

        try {
            $request = new GuzzleRequest('POST', 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase', $headers);
            $res = $client->sendAsync($request, $options)->wait();
            return ($res->getBody());
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'ABA request failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function aba_pay_interface()
    {
        return Inertia::render('aba_pay_interface');
    }
    public function Callback()
    {
        return 'Callback';
    }
    public function Canceled()
    {
        return 'Canceled';
    }
    public function Success()
    {
        return 'Success';
    }
}
