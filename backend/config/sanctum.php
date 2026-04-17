<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Stateful Domains
    |--------------------------------------------------------------------------
    | Requests from these domains will receive stateful API authentication
    | cookies. Typically your application's local and production domains.
    */

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', implode(',', [
        'localhost',
        'localhost:4200',
        '127.0.0.1',
        '127.0.0.1:4200',
        '::1',
        parse_url(env('APP_URL', 'http://localhost'), PHP_URL_HOST),
    ]))),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Guards
    |--------------------------------------------------------------------------
    | This array contains the authentication guards that will be checked when
    | Sanctum is trying to authenticate an incoming request. If none of these
    | guards are able to authenticate the request, Sanctum will use the bearer
    | token that's present on an incoming request for authentication.
    */

    'guard' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    | Setting this value to null indicates that personal access tokens never
    | expire. Otherwise, this value will be used as the number of minutes
    | before a token is considered expired and invalid.
    */

    'expiration' => env('SANCTUM_TOKEN_EXPIRATION', 720), // 12 hours

    /*
    |--------------------------------------------------------------------------
    | Token Prefix
    |--------------------------------------------------------------------------
    | Sanctum can prefix new tokens in order to take advantage of hardware
    | security modules that may be scanning for tokens within your database.
    */

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Middleware
    |--------------------------------------------------------------------------
    | When authenticating your first-party SPA with Sanctum you may need to
    | customize some of the middleware Sanctum uses while processing the
    | request. You may change the middleware listed below as required for
    | your application.
    */

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies'      => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token'  => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],

];
