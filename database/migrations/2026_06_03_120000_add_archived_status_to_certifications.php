<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('certifications')) {
            return;
        }

        if (! Schema::hasColumn('certifications', 'archived_from_status')) {
            Schema::table('certifications', function (Blueprint $table) {
                $table->string('archived_from_status', 50)->nullable()->after('status');
            });
        }

        DB::statement("ALTER TABLE certifications MODIFY status ENUM(
            'draft',
            'pending_approval',
            'pending_review',
            'revision_required',
            'approved',
            'published',
            'declined',
            'denied',
            'archived'
        ) NOT NULL DEFAULT 'draft'");
    }

    public function down(): void
    {
        if (! Schema::hasTable('certifications')) {
            return;
        }

        DB::table('certifications')->where('status', 'archived')->update(['status' => 'draft']);

        DB::statement("ALTER TABLE certifications MODIFY status ENUM(
            'draft',
            'pending_approval',
            'pending_review',
            'revision_required',
            'approved',
            'published',
            'declined',
            'denied'
        ) NOT NULL DEFAULT 'draft'");

        if (Schema::hasColumn('certifications', 'archived_from_status')) {
            Schema::table('certifications', function (Blueprint $table) {
                $table->dropColumn('archived_from_status');
            });
        }
    }
};
