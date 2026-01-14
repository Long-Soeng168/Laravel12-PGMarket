<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class ApolloService
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.apollo.base_url')
            ?? throw new \Exception('APOLLO_BASE_URL not set');
    }

    /* ---------------- AUTHORIZE ---------------- */
    public function authorize(): string
    {
        $res = Http::post($this->baseUrl . '/api/integration/pgmarket/authorize', [
            'device_os' => 'Web',
            'device_id' => md5(config('app.key')),
        ])->json();

        if (!($res['success'] ?? false)) {
            throw new \Exception('Apollo authorize failed: ' . json_encode($res));
        }

        Cache::put(
            'apollo_token',
            $res['data']['token'],
            now()->addDays(30)
        );

        return $res['data']['token'];
    }

    /* ---------------- LOGIN ---------------- */
    public function login(): string
    {
        $token = Cache::get('apollo_token') ?? $this->authorize();

        $res = Http::withHeaders([
            'Authorize' => $token,
        ])->post($this->baseUrl . '/api/integration/pgmarket/login', [
            'email' => config('services.apollo.email'),
            'password' => config('services.apollo.password'),
        ])->json();

        if (!($res['success'] ?? false)) {
            throw new \Exception('Apollo login failed: ' . json_encode($res));
        }

        Cache::put(
            'apollo_access_token',
            $res['data']['access_token'],
            now()->addDays(30)
        );

        return $res['data']['access_token'];
    }

    /* ---------------- HEADERS ---------------- */
    protected function headers(): array
    {
        return [
            'Authorize' => Cache::get('apollo_token') ?? $this->authorize(),
            'Auth' => Cache::get('apollo_access_token') ?? $this->login(),
        ];
    }

    /* ---------------- PROVINCES ---------------- */
    public function provinces(): array
    {
        return Http::withHeaders($this->headers())
            ->get($this->baseUrl . '/api/integration/pgmarket/provinces')
            ->json('data') ?? [];
    }

    /* ---------------- DISTRICTS ---------------- */
    public function districts(int $provinceId): array
    {
        return Http::withHeaders($this->headers())
            ->get($this->baseUrl . '/api/integration/pgmarket/districts', [
                'province_id' => $provinceId,
            ])
            ->json('data') ?? [];
    }

    /* ---------------- COMMUNES ---------------- */
    public function communes(int $districtId): array
    {
        return Http::withHeaders($this->headers())
            ->get($this->baseUrl . '/api/integration/pgmarket/communes', [
                'district_id' => $districtId,
            ])
            ->json('data') ?? [];
    }

    /* ---------------- VILLAGES ---------------- */
    public function villages(int $communeId): array
    {
        return Http::withHeaders($this->headers())
            ->get($this->baseUrl . '/api/integration/pgmarket/villages', [
                'commune_id' => $communeId,
            ])
            ->json('data') ?? [];
    }

    /* ---------------- DELIVERY FEE ---------------- */
    public function estimateFee(array $data): array
    {
        return Http::withHeaders($this->headers())
            ->get($this->baseUrl . '/api/integration/pgmarket/booking/delivery-fee', $data)
            ->json('data') ?? [];
    }

    /* ---------------- CREATE BOOKING ---------------- */
    public function createBooking(array $payload): array
    {
        $res = Http::withHeaders($this->headers())
            ->post($this->baseUrl . '/api/integration/pgmarket/booking/store', $payload);

        $json = $res->json();

        // If API failed or returned unexpected data
        if (!$json || !isset($json['success'])) {
            return [
                'success' => false,
                'message' => 'Apollo API did not return a valid response',
            ];
        }

        return $json; // Always returns array now
    }
    /* ---------------- BOOKING LIST ---------------- */
    public function bookings(): array
    {
        return Http::withHeaders($this->headers())
            ->get($this->baseUrl . '/api/integration/pgmarket/booking/list')
            ->json('data.resources') ?? [];
    }

    /* ---------------- BOOKING DETAIL ---------------- */
    public function bookingDetail(string $code): array
    {
        return Http::withHeaders($this->headers())
            ->get($this->baseUrl . "/api/integration/pgmarket/booking/detail/{$code}")
            ->json('data') ?? [];
    }
}
