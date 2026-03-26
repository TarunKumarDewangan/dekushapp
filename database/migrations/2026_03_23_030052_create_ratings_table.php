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
        Schema::create('ratings', function (Blueprint $col) {
            $col->id();
            $col->foreignId('user_id')->constrained()->onDelete('cascade');
            $col->morphs('ratable'); // This creates ratable_id and ratable_type
            $col->integer('rating')->default(0); // 1 to 5 stars
            $col->text('comment')->nullable();
            $col->timestamps();
            
            // Limit to one rating per user per item
            $col->unique(['user_id', 'ratable_id', 'ratable_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
