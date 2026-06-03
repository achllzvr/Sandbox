<?php

namespace App\Providers;

use App\Models\Certification;
use App\Observers\CertificationObserver;
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
        Certification::observe(CertificationObserver::class);

        try {
            app(\App\Services\GamificationService::class)->seedDefaultAchievements();
        } catch (\Throwable) {
            // Tables may not exist until migrations run.
        }

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
