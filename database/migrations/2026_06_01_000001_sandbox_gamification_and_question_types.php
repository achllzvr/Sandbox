<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            if (! Schema::hasColumn('questions', 'interaction_type')) {
                $table->string('interaction_type', 32)->default('multiple_choice')->after('question_type');
            }
            if (! Schema::hasColumn('questions', 'metadata')) {
                $table->json('metadata')->nullable()->after('interaction_type');
            }
        });

        if (! Schema::hasTable('gamification_events')) {
            Schema::create('gamification_events', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->string('event_type', 64);
                $table->integer('amount')->default(0);
                $table->string('source_type', 64)->nullable();
                $table->unsignedBigInteger('source_id')->nullable();
                $table->json('meta')->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->index(['user_id', 'created_at']);
                $table->index('event_type');
            });
        }

        if (! Schema::hasTable('achievements')) {
            Schema::create('achievements', function (Blueprint $table) {
                $table->id();
                $table->string('slug', 64)->unique();
                $table->string('label', 150);
                $table->string('icon', 16)->default('⭐');
                $table->text('description')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('user_achievements')) {
            Schema::create('user_achievements', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('achievement_id');
                $table->timestamp('unlocked_at')->useCurrent();
                $table->unique(['user_id', 'achievement_id']);
            });
        }

        if (! Schema::hasTable('daily_quests')) {
            Schema::create('daily_quests', function (Blueprint $table) {
                $table->id();
                $table->string('slug', 64)->unique();
                $table->string('label', 200);
                $table->string('event_type', 64);
                $table->unsignedInteger('target')->default(1);
                $table->unsignedInteger('reward_sd')->default(10);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('user_daily_quest_progress')) {
            Schema::create('user_daily_quest_progress', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('daily_quest_id');
                $table->date('quest_date');
                $table->unsignedInteger('progress')->default(0);
                $table->boolean('is_claimed')->default(false);
                $table->timestamp('claimed_at')->nullable();
                $table->unique(['user_id', 'daily_quest_id', 'quest_date'], 'user_quest_date_unique');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('user_daily_quest_progress');
        Schema::dropIfExists('daily_quests');
        Schema::dropIfExists('user_achievements');
        Schema::dropIfExists('achievements');
        Schema::dropIfExists('gamification_events');

        Schema::table('questions', function (Blueprint $table) {
            if (Schema::hasColumn('questions', 'metadata')) {
                $table->dropColumn('metadata');
            }
            if (Schema::hasColumn('questions', 'interaction_type')) {
                $table->dropColumn('interaction_type');
            }
        });
    }
};
