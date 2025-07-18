<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;

use Illuminate\Http\RedirectResponse;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;
use Stripe\Stripe;

class StripeController extends Controller
{
    /**
     * @return View|Factory|Application
     */
    public function checkout(): View|Factory|Application
    {
        return view('stripe_checkout');
    }

    /**
     * @return RedirectResponse
     * @throws ApiErrorException
     */
    public function test(): RedirectResponse
    {
        Stripe::setApiKey(config('stripe.test.sk'));

        $session = Session::create([
            'line_items'  => [
                [
                    'price_data' => [
                        'currency'     => 'gbp',
                        'product_data' => [
                            'name' => 'T-shirt',
                        ],
                        'unit_amount'  => 100,
                    ],
                    'quantity'   => 1,
                ],
            ],
            'mode'        => 'payment',
            'success_url' => url('success/1'),
            'cancel_url'  => route('checkout'),
        ]);

        return redirect()->away($session->url);
    }

    /**
     * @return RedirectResponse
     * @throws ApiErrorException
     */
    public function live(): RedirectResponse
    {
        Stripe::setApiKey(config('stripe.live.sk'));

        $session = Session::create([
            'line_items'  => [
                [
                    'price_data' => [
                        'currency'     => 'gbp',
                        'product_data' => [
                            'name' => 'T-shirt',
                        ],
                        'unit_amount'  => 100,
                    ],
                    'quantity'   => 1,
                ],
            ],
            'mode'        => 'payment',
            'success_url' => url('success/1'),
            'cancel_url'  => route('checkout'),
        ]);

        return redirect()->away($session->url);
    }

    /**
     * @return View|Factory|Application
     */
    public function success(int $id): View|Factory|Application
    {
        // Create order
        $order = Order::create([
            'name'    => 'Guest ' . $id,
            'phone'   => '0000',
            'email'   => null,
            'address' => null,
            'note'    => null,
            'total'   => 0,
        ]);
        return view('success');
    }
}
