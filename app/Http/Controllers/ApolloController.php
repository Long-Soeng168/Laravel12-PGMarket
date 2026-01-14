<?php

namespace App\Http\Controllers;

use App\Models\Province;
use App\Models\Shop;
use App\Services\ApolloService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApolloController extends Controller
{
    public function index(ApolloService $apollo)
    {
        $provinces = Province::orderBy('name')->get();
        $shop = Shop::where('id', 23)->first();

        return Inertia::render('Apollo/Dashboard', [
            'provinces' => $provinces,
            'shop' => $shop,
            'bookings' => $apollo->bookings(),
        ]);
    }

    /* ---------------- ESTIMATE FEE ---------------- */
    public function estimate(Request $request, ApolloService $apollo)
    {
        $data = $request->validate([
            'sender_province_id' => 'required|integer',
            'receiver_province_id' => 'required|integer',
            'weight' => 'required|numeric|min:1',
            'service_type' => 'required|in:same_day,next_day,express',
        ]);

        return $apollo->estimateFee($data);
    }

    /* ---------------- CREATE BOOKING ---------------- */
    public function store(Request $request, ApolloService $apollo)
    {
        $data = $request->validate([
            'sender_province_id' => 'required|integer',
            'receiver_province_id' => 'required|integer',
            'weight' => 'required|numeric|min:1',
            'service_type' => 'required|in:same_day,next_day,express',
            'delivery_fee' => 'required|numeric|min:0',
        ]);

        // Build payload based on your sample
        $payload = [
            'book_datetime' => now()->format('Y-m-d H:i:s'),
            'sender_name' => 'APL Shop',
            'sender_phone' => '099887766',
            'sender_address' => '#33, st77',
            'sender_latitude' => '11.5530318',
            'sender_longitude' => '104.9175895',
            'sender_province_id' => $data['sender_province_id'],
            'sender_district_id' => 103, // hardcoded for demo
            'sender_commune_id' => 892,  // hardcoded for demo
            'sender_village_id' => null,
            'delivery_fee' => $data['delivery_fee'],
            'service_type' => $data['service_type'],
            'parcel' => [
                'client_reference' => 'ORDER-' . now()->timestamp,
                'fee_payer' => 'sender',
                'images' => [],
                'parcel_uom_qty' => 1,
                'parcel_dimension' => '',
                'parcel_volume' => '',
                'parcel_weight' => $data['weight'],
                'receiver_address' => '#K7, st288',
                'receiver_name' => 'Test Receiver',
                'receiver_latitude' => '11.5539928',
                'receiver_longitude' => '104.9085904',
                'receiver_phone' => '012345611',
                'receiver_province_id' => $data['receiver_province_id'],
                'receiver_district_id' => 1,
                'receiver_commune_id' => 1,
                'receiver_village_id' => null,
                'note' => '',
            ],
        ];

        $response = $apollo->createBooking($payload);

        if (!($response['success'] ?? false)) {
            return response()->json([
                'success' => false,
                'message' => $response['message'] ?? 'Failed to create booking',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Booking created successfully!',
            'booking_code' => $response['data'] ?? null,
        ]);
    }




    public function bookingDetail(string $code, ApolloService $apollo)
    {
        return Inertia::render('Apollo/BookingDetail', [
            'booking' => $apollo->bookingDetail($code),
        ]);
    }
}
