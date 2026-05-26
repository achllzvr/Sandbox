<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        view()->composer('components.navbar', function ($view) {
            $role = session('role') ?: 'guest';
            $navConfig = config('navigation');

            $links = $navConfig[$role] ?? $navConfig['guest'];
            $view->with([
                'navLinks' => $links,
                'navUserName' => session('full_name') ?? session('email'),
                'navRole' => $role,
            ]);
        });
    }
}
