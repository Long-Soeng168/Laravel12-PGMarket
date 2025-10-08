<?php

namespace App\Http\Controllers\UserDashboard;

use App\Exports\ItemDailyViewExport;
use App\Helpers\ImageHelper;
use App\Helpers\TelegramHelper;
use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\ItemBrand;
use App\Models\ItemCategory;
use App\Models\ItemDailyView;
use App\Models\ItemImage;
use App\Models\Order;
use App\Models\Shop;
use App\Services\PayWayService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class UserOrderController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            // new Middleware('role:Shop', only: ['index', 'show']),
            // new Middleware('role:Shop', only: ['create', 'store']),
            // new Middleware('role:Shop', only: ['edit', 'update', 'update_status']),
            // new Middleware('role:Shop', only: ['destroy', 'destroy_image']),
        ];
    }

    protected $payWayService;

    public function __construct(PayWayService $payWayService)
    {
        $this->payWayService = $payWayService;
    }

    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');

        $query = Order::query();

        $query->with('shop');

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('order_number', 'LIKE', "%{$search}%");
            });
        }

        $query->where('user_id', $request->user()->id);

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        // return $tableData;
        return Inertia::render('user-dashboard/orders/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        dd('Create Function');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        dd('Store Function');
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $user_order)
    {
        if ($user_order->user_id != Auth::user()->id) {
            abort(403, 'Unauthorized resource');
        }

        $tran_id = 'TXN001234567';
        $amount = '1.00';
        $shipping = '2.00';
        $email = 'sokha.tim@ababank.com'; // or any default payment option if needed
        $req_time = date('YmdHis');
        $merchant_id = config('payway.merchant_id');
        $payment_option = 'abapay_khqr'; // or any default payment option if needed
        $skip_success_page = 1; // or any default payment option if needed
        $currency = 'USD'; // or any default payment option if needed
        $return_url = env('APP_URL') . "/aba/callback/{$tran_id}";
        $cancel_url = env('APP_URL') . "/aba/cancel?tran_id={$tran_id}";
        $continue_success_url = env('APP_URL') . "/aba/success?tran_id={$tran_id}";
        // $return_params ='payment_success';
        $hash = $this->payWayService->getHash(
            $req_time . $merchant_id . $tran_id . $amount . $shipping .
                $email . $payment_option . $return_url . $cancel_url . $continue_success_url . $skip_success_page
        );

        return Inertia::render('user-dashboard/orders/Show', [
            'order_detail' => $user_order->load('order_items.item.images', 'shop'),
            'readOnly' => true,
            'api_url' => config('payway.api_url'),
            'hash' => $hash,
            'tran_id' => $tran_id,
            'amount' => $amount,
            'shipping' => $shipping,
            'email' => $email,
            'payment_option' => $payment_option,
            'merchant_id' => $merchant_id,
            'req_time' => $req_time,
            'return_url' => $return_url,
            'cancel_url' => $cancel_url,
            'continue_success_url' => $continue_success_url,
            'skip_success_page' => $skip_success_page,
            'currency' => $currency,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */

    public function edit(Item $user_order)
    {
        if ($user_order->user_id != Auth::user()->id) {
            abort(404);
        }
        $editData = $user_order->load('order_items.item.images');
        dd($editData);
        return Inertia::render('user-dashboard/orders/Create', [
            'editData' => $editData,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $user_order)
    {
        if ($user_order->user_id != Auth::user()->id) {
            abort(404);
        }
        dd($request->all());
    }

    public function update_status(Request $request, Item $user_item)
    {
        if ($user_item->shop_id != Auth::user()->shop_id) {
            abort(404);
        }
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $user_item->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $user_order)
    {
        if ($user_order->user_id != Auth::user()->id) {
            abort(404);
        }
        if ($user_order->status != 'pending') {
            abort(403, 'Cannot delete: status is not pending');
        }

        $user_order->delete();
        return redirect()->back()->with('success', 'Order deleted successfully.');
    }
}
