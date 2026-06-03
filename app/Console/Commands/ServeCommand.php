<?php

namespace App\Console\Commands;

use Illuminate\Foundation\Console\ServeCommand as BaseServeCommand;
use Symfony\Component\Process\PhpExecutableFinder;

class ServeCommand extends BaseServeCommand
{
    /**
     * @return array<int, string>
     */
    protected function serverCommand()
    {
        $server = file_exists(base_path('server.php'))
            ? base_path('server.php')
            : base_path('vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php');

        $command = [
            (new PhpExecutableFinder)->find(false),
        ];

        $ini = base_path('php-dev.ini');
        if (is_file($ini)) {
            $command[] = '-c';
            $command[] = $ini;
        }

        $command[] = '-S';
        $command[] = $this->host().':'.$this->port();
        $command[] = $server;

        return $command;
    }
}
