<?php

namespace App\Http\Controllers;

use App\Helpers\TelegramHelper;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class OrderController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:order view', only: ['index', 'show']),
            new Middleware('permission:order delete', only: ['destroy']),
        ];
    }
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');

        $query = Order::query();

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->withCount('order_items')->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/orders/Index', [
            'tableData' => $tableData,
        ]);
    }
    public function show(Order $order)
    {
        $orderItems = OrderItem::with('item.images')->where('order_id', $order->id)->get();
        // return $orderItems;
        return Inertia::render('admin/orders/Show', [
            'order' => $order,
            'orderItems' => $orderItems
        ]);
    }
    public function destroy(Order $order)
    {
        $order->delete();
        return redirect()->back()->with('success', 'Message deleted successfully.');
    }

    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'name'       => 'nullable|string|max:255',
            'phone'      => 'nullable|string|max:20',
            'email'      => 'nullable|email|max:255',
            'address'    => 'nullable|string|max:255',
            'note'       => 'nullable|string',
            'total'      => 'nullable|numeric',
            'transaction_id'       => 'nullable|string',
            'payment_type'       => 'nullable|string',
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

            // Create order
            $order = Order::create([
                'transaction_id'   => $validated['transaction_id'] ?? null,
                'payment_type'   => $validated['payment_type'] ?? null,
                'user_id'    => $request->user()?->id ?? null,
                'name'    => $request->user()?->name ?? 'Guest',
                'phone'   => $request->user()?->phone ?? null,
                'email'   => $request->user()?->email ?? null,
                'address' => $request->user()?->address ?? null,
                'note'    => $validated['note'] ?? null,
                'total'   => $validated['total'] ?? 0,
            ]);


            // Create order items
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

            // return back()->with('success', 'Order placed successfully!');

            $result = TelegramHelper::sendOrderItems($order);
            // Normal Process
            if ($result['success']) {
                return back()->with('success', 'Order placed successfully!');
            } else {
                return back()->with('error', $result['message']);
            }

            // Payment Process
            // if ($result['success']) {
            //     return response()->json([
            //         'success' => true,
            //         'message' => 'Order placed successfully!'
            //     ]);
            // } else {
            //     return response()->json([
            //         'success' => false,
            //         'message' => $result['message']
            //     ], 500);
            // }
        } catch (\Exception $e) {
            DB::rollback();

            return back()->withErrors([
                'general' => 'Failed to place order. ' . $e->getMessage()
            ]);
        }
    }
}
