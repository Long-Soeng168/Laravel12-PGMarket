<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->enum('delivery_type', ['system_delivery', 'seller_delivery'])
                ->default('seller_delivery')
                ->after('province_id');

            $table->decimal('delivery_price_per_kg', 10, 2)
                ->nullable()
                ->default(1)
                ->after('delivery_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->dropColumn(['delivery_type', 'delivery_price_per_kg']);
        });
    }
};
