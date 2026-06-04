<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('vouchers')) {
            Schema::table('vouchers', function (Blueprint $table) {
                if (! Schema::hasColumn('vouchers', 'recipient_email')) {
                    $table->string('recipient_email')->nullable()->after('used_by');
                }
                if (! Schema::hasColumn('vouchers', 'sent_to_email_at')) {
                    $table->timestamp('sent_to_email_at')->nullable()->after('expires_at');
                }
                if (! Schema::hasColumn('vouchers', 'final_exam_unlocked_at')) {
                    $table->timestamp('final_exam_unlocked_at')->nullable()->after('sent_to_email_at');
                }
            });
        }

        if (Schema::hasTable('enrollments')) {
            Schema::table('enrollments', function (Blueprint $table) {
                if (! Schema::hasColumn('enrollments', 'final_exam_unlocked_at')) {
                    $table->timestamp('final_exam_unlocked_at')->nullable()->after('enrolled_at');
                }
            });
        }

        if (Schema::hasTable('certifications')) {
            Schema::table('certifications', function (Blueprint $table) {
                if (! Schema::hasColumn('certifications', 'badge_type')) {
                    $table->string('badge_type', 32)->default('professional_certificate')->after('accent_color');
                }
                if (! Schema::hasColumn('certifications', 'badge_label')) {
                    $table->string('badge_label')->nullable()->after('badge_type');
                }
                if (! Schema::hasColumn('certifications', 'show_verified_icon')) {
                    $table->boolean('show_verified_icon')->default(true)->after('badge_label');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('vouchers')) {
            Schema::table('vouchers', function (Blueprint $table) {
                $columns = ['recipient_email', 'sent_to_email_at', 'final_exam_unlocked_at'];
                foreach ($columns as $column) {
                    if (Schema::hasColumn('vouchers', $column)) {
                        $table->dropColumn($column);
                    }
                }
            });
        }

        if (Schema::hasTable('enrollments')) {
            Schema::table('enrollments', function (Blueprint $table) {
                if (Schema::hasColumn('enrollments', 'final_exam_unlocked_at')) {
                    $table->dropColumn('final_exam_unlocked_at');
                }
            });
        }

        if (Schema::hasTable('certifications')) {
            Schema::table('certifications', function (Blueprint $table) {
                foreach (['badge_type', 'badge_label', 'show_verified_icon'] as $column) {
                    if (Schema::hasColumn('certifications', $column)) {
                        $table->dropColumn($column);
                    }
                }
            });
        }
    }
};
