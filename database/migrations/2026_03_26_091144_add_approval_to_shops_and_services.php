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
            $table->boolean('is_approved')->default(false)->after('owner_id');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->boolean('is_approved')->default(false)->after('provider_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->dropColumn('is_approved');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('is_approved');
        });
    }
};
