<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

class RestorePlaytestDatabase extends Command
{
    protected $signature = 'db:restore-playtest {--force : Skip confirmation prompt}';

    protected $description = 'Rebuild sandbox_db schema and load student playtest users + seed data';

    public function handle(): int
    {
        if (! $this->option('force') && ! $this->confirm('This will WIPE the current database and restore playtest data. Continue?')) {
            $this->warn('Aborted.');

            return self::FAILURE;
        }

        $bootstrap = database_path('sandbox_playtest_bootstrap.sql');
        $seed = database_path('student_playtest_seed.sql');
        $full = database_path('sandbox_full_restore.sql');

        $this->info('Dropping all tables…');
        Schema::disableForeignKeyConstraints();
        Schema::dropAllTables();
        Schema::enableForeignKeyConstraints();

        if (File::exists($full)) {
            $this->info('Importing full restore SQL…');
            $this->runSqlFile($full);
        } else {
            if (! File::exists($bootstrap)) {
                $this->error("Missing {$bootstrap}");

                return self::FAILURE;
            }

            if (! File::exists($seed)) {
                $this->error("Missing {$seed}");

                return self::FAILURE;
            }

            $this->info('Importing base schema + users…');
            $this->runSqlFile($bootstrap);

            $this->info('Importing playtest shells, quizzes, and enrollments…');
            $this->runSqlFile($seed);
        }

        $this->info('Syncing shell accent colors from cover images…');
        $this->call('certifications:sync-themes');

        $userCount = DB::table('users')->count();
        $certCount = DB::table('certifications')->count();

        $this->newLine();
        $this->info("Done. users={$userCount}, certifications={$certCount}");
        $this->line('Test logins (see database/student_playtest_seed.sql header):');
        $this->line('  educavrabina29@gmail.com  / Abcd1234!');
        $this->line('  roanbaral3@gmail.com      / G!G1mu32');
        $this->line('  admin@gmail.com           / admin123');

        return self::SUCCESS;
    }

    private function runSqlFile(string $path): void
    {
        $sql = File::get($path);
        DB::unprepared($sql);
    }
}
