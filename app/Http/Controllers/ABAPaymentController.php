<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log; // For logging errors and responses

class ABAPaymentController extends Controller
{
    /**
     * Handle the checkout process by sending a purchase request to ABA PayWay.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function checkout(Request $request)
    {
        // Using provided API credentials directly as requested
        $api_key = "c05359175db7d077a73fbcec947fd32deeef63e9"; // Your Public Key
        $merchant_id = "ec460938"; // Your Merchant ID
        $api_url = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase"; // Your provided API URL

        // Note: The RSA Public Key and RSA Private Key provided are not used in this HMAC-SHA512 hashing implementation.
        // They would be required for RSA-based encryption/signing if ABA PayWay required it for this specific API call.

        // Prepare all variables (empty string for optional fields if not used)
        $req_time = gmdate("YmdHis");
        $tran_id = '000001'; // Generate a unique transaction ID for your system
        $amount = "100.00"; // Example amount, you should get this from your request or order
        $items = base64_encode(json_encode([
            ["name" => "Product 1", "quantity" => 1, "price" => 100.00] // Example items
        ]));
        $shipping = "0.00";
        $firstname = "";          // optional
        $lastname = "";           // optional
        $email = "";              // optional
        $phone = "";              // optional
        $type = "purchase";       // optional, default purchase
        $payment_option = "";     // optional
        $return_url = url('/aba/payment/success'); // Use Laravel's url() helper for dynamic URLs
        $cancel_url = url('/aba/payment/cancel');   // Use Laravel's url() helper for dynamic URLs
        $continue_success_url = "";  // optional
        $return_deeplink = "";       // optional
        $currency = "USD";           // optional
        $custom_fields = "";         // optional
        $return_params = "";         // optional
        $payout = "";                // optional
        $lifetime = "";              // optional
        $additional_params = "";     // optional
        $google_pay_token = "";      // optional
        $skip_success_page = "";     // optional

        // Concatenate string exactly in order, empty strings if missing
        $b4hash = $req_time
            . $merchant_id
            . $tran_id
            . $amount
            . $items
            . $shipping
            . $firstname
            . $lastname
            . $email
            . $phone
            . $type
            . $payment_option
            . $return_url
            . $cancel_url
            . $continue_success_url
            . $return_deeplink
            . $currency
            . $custom_fields
            . $return_params
            . $payout
            . $lifetime
            . $additional_params
            . $google_pay_token
            . $skip_success_page;

        // Generate hash (HMAC-SHA512, Base64 encoded)
        $hash = base64_encode(hash_hmac('sha512', $b4hash, $api_key, true));

        // --- DEBUGGING LOGS ---
        Log::debug('ABA Checkout Request Data:');
        Log::debug('req_time: ' . $req_time);
        Log::debug('merchant_id: ' . $merchant_id);
        Log::debug('tran_id: ' . $tran_id);
        Log::debug('amount: ' . $amount);
        Log::debug('items (base64): ' . $items);
        Log::debug('shipping: ' . $shipping);
        Log::debug('firstname: ' . $firstname);
        Log::debug('lastname: ' . $lastname);
        Log::debug('email: ' . $email);
        Log::debug('phone: ' . $phone);
        Log::debug('type: ' . $type);
        Log::debug('payment_option: ' . $payment_option);
        Log::debug('return_url: ' . $return_url);
        Log::debug('cancel_url: ' . $cancel_url);
        Log::debug('continue_success_url: ' . $continue_success_url);
        Log::debug('return_deeplink: ' . $return_deeplink);
        Log::debug('currency: ' . $currency);
        Log::debug('custom_fields: ' . $custom_fields);
        Log::debug('return_params: ' . $return_params);
        Log::debug('payout: ' . $payout);
        Log::debug('lifetime: ' . $lifetime);
        Log::debug('additional_params: ' . $additional_params);
        Log::debug('google_pay_token: ' . $google_pay_token);
        Log::debug('skip_success_page: ' . $skip_success_page);
        Log::debug('b4hash string: ' . $b4hash);
        Log::debug('Generated hash: ' . $hash);
        // --- END DEBUGGING LOGS ---

        // Prepare multipart form fields
        $multipart = [
            ['name' => 'req_time', 'contents' => $req_time],
            ['name' => 'merchant_id', 'contents' => $merchant_id],
            ['name' => 'tran_id', 'contents' => $tran_id],
            ['name' => 'amount', 'contents' => $amount],
            ['name' => 'items', 'contents' => $items],
            ['name' => 'shipping', 'contents' => $shipping],
            ['name' => 'firstname', 'contents' => $firstname],
            ['name' => 'lastname', 'contents' => $lastname],
            ['name' => 'email', 'contents' => $email],
            ['name' => 'phone', 'contents' => $phone],
            ['name' => 'type', 'contents' => $type],
            ['name' => 'payment_option', 'contents' => $payment_option],
            ['name' => 'return_url', 'contents' => $return_url],
            ['name' => 'cancel_url', 'contents' => $cancel_url],
            ['name' => 'continue_success_url', 'contents' => $continue_success_url],
            ['name' => 'return_deeplink', 'contents' => $return_deeplink],
            ['name' => 'currency', 'contents' => $currency],
            ['name' => 'custom_fields', 'contents' => $custom_fields],
            ['name' => 'return_params', 'contents' => $return_params],
            ['name' => 'payout', 'contents' => $payout],
            ['name' => 'lifetime', 'contents' => $lifetime],
            ['name' => 'additional_params', 'contents' => $additional_params],
            ['name' => 'google_pay_token', 'contents' => $google_pay_token],
            ['name' => 'skip_success_page', 'contents' => $skip_success_page],
            ['name' => 'hash', 'contents' => $hash],
        ];

        // Send request
        $client = new Client();

        try {
            $response = $client->post($api_url, [
                'multipart' => $multipart,
                // Remove 'allow_redirects' => false, as we now expect a JSON response.
                // Guzzle will not follow redirects if the response is JSON.
            ]);

            $body = $response->getBody()->getContents();
            $result = json_decode($body, true);

            // Log the full response for debugging
            Log::info('ABA PayWay API Response: ' . json_encode($result));

            if (isset($result['status']['code']) && $result['status']['code'] === '00') {
                // Return the full successful JSON response from ABA to the frontend
                return response()->json($result);
            } else {
                // Handle non-success responses or unexpected formats
                Log::error('ABA Payment request failed or returned unexpected status: ' . $body);
                return response()->json(['error' => 'Payment request failed.', 'details' => $result], 400);
            }
        } catch (RequestException $e) { // Catch Guzzle-specific exceptions for network/request errors
            Log::error('Guzzle Request Error during ABA checkout: ' . $e->getMessage());
            if ($e->hasResponse()) {
                Log::error('ABA PayWay Error Response Body: ' . $e->getResponse()->getBody()->getContents());
            }
            return response()->json(['error' => 'Error processing payment.', 'details' => $e->getMessage()], 500);
        } catch (\Exception $e) { // Catch other general exceptions
            Log::error('General Error during ABA checkout: ' . $e->getMessage());
            return response()->json(['error' => 'Error processing payment.', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle the callback from ABA after a successful payment.
     * This is where you would update your order status.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function paymentSuccess(Request $request)
    {
        // Log the full request for debugging
        Log::info('ABA Payment Success Callback:', $request->all());

        // You might receive parameters like 'tran_id', 'status', etc.
        // from ABA in the callback. Verify these against your stored transaction.
        $tranId = $request->input('tran_id');
        $status = $request->input('status'); // Expected to be 'success' or similar
        $responseHash = $request->input('hash'); // The hash sent by ABA

        // It's crucial to re-verify the hash sent by ABA to ensure data integrity
        // The b4hash for response verification might be different from the request hash.
        // Consult ABA documentation for the exact response hash calculation.
        // For example, it might be: $req_time . $merchant_id . $tran_id . $status . $api_key
        // For this example, we'll just log and assume success.
        Log::info("Payment Success for Transaction ID: {$tranId} with Status: {$status}");

        // Here, you would typically:
        // 1. Find the order in your database using $tranId.
        // 2. Update the order status to 'completed' or 'paid'.
        // 3. Perform any other post-payment logic (e.g., send confirmation email).

        return response("Payment successful! Transaction ID: {$tranId}", 200);
    }

    /**
     * Handle the callback from ABA after a cancelled payment.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function paymentCancel(Request $request)
    {
        Log::info('ABA Payment Cancel Callback:', $request->all());

        $tranId = $request->input('tran_id');
        Log::info("Payment Cancelled for Transaction ID: {$tranId}");

        // Here, you would typically:
        // 1. Find the order in your database using $tranId.
        // 2. Update the order status to 'cancelled'.

        return response("Payment cancelled. Transaction ID: {$tranId}", 200);
    }

    /**
     * Check the status of a payment with ABA PayWay using the transaction ID.
     * This is useful for backend verification or manual checks.
     *
     * @param Request $request Should contain 'tran_id'
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkPaymentStatus(Request $request)
    {
        $tran_id = $request->input('tran_id');

        if (empty($tran_id)) {
            return response()->json(['error' => 'Transaction ID is required.'], 400);
        }

        // Using provided API credentials directly as requested
        $api_key = "c05359175db7d077a73fbcec947fd32deeef63e9"; // Your Public Key
        $merchant_id = "ec460938"; // Your Merchant ID
        // This is the assumed API endpoint for checking transaction status
        $api_url = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/check-transaction";

        // Note: The RSA Public Key and RSA Private Key provided are not used in this HMAC-SHA512 hashing implementation.
        // They would be required for RSA-based encryption/signing if ABA PayWay required it for this specific API call.

        $req_time = gmdate("YmdHis");

        // The string to hash for status check is usually simpler: req_time + merchant_id + tran_id
        // ALWAYS refer to ABA's official documentation for the exact hash calculation for inquiries.
        $b4hash = $req_time
            . $merchant_id
            . $tran_id;

        $hash = base64_encode(hash_hmac('sha512', $b4hash, $api_key, true));

        // Prepare multipart form fields for status check
        $multipart = [
            ['name' => 'req_time', 'contents' => $req_time],
            ['name' => 'merchant_id', 'contents' => $merchant_id],
            ['name' => 'tran_id', 'contents' => $tran_id],
            ['name' => 'hash', 'contents' => $hash],
        ];

        $client = new Client();

        try {
            $response = $client->post($api_url, [
                // ABA PayWay usually expects 'multipart/form-data' for inquiry requests as well
                'multipart' => $multipart,
            ]);

            $body = $response->getBody()->getContents();
            $result = json_decode($body, true);

            if (isset($result['status'])) {
                Log::info('ABA Transaction Status Check Result:', $result);
                return response()->json([
                    'success' => true,
                    'message' => 'Transaction status retrieved successfully.',
                    'data' => $result
                ]);
            } else {
                Log::error('ABA Transaction status check failed: ' . $body);
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to retrieve transaction status.',
                    'details' => $result
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('Error during ABA transaction status check: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error checking payment status.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
