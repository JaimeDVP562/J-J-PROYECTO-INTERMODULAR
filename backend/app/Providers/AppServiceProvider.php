<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\Router;
use Illuminate\Http\Resources\Json\JsonResource;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Eliminar el wrapper { data: [] } de las colecciones de recursos JSON
        JsonResource::withoutWrapping();

        // register api token middleware alias
        $router = $this->app->make(Router::class);
        $router->aliasMiddleware('auth.apitoken', \App\Http\Middleware\AuthenticateWithApiToken::class);
        // api routes are registered by the application's RouteServiceProvider
    }
}
