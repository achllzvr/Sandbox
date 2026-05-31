<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
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
        // Ensure asset()/route() URLs match the real browser path (e.g. /Sandbox/public on XAMPP).
        if (! $this->app->runningInConsole()) {
            $request = $this->app->make('request');
            if ($request->hasHeader('Host')) {
                $root = rtrim($request->getSchemeAndHttpHost().$request->getBaseUrl(), '/');
                URL::forceRootUrl($root);
            }
        }

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
