<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;

class AuthenticateWithApiToken
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $authHeader = $request->header('Authorization');
        $token = null;

        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
        } elseif ($request->bearerToken()) {
            $token = $request->bearerToken();
        } elseif ($request->header('X-API-TOKEN')) {
            $token = $request->header('X-API-TOKEN');
        }

        if ($token) {
            $user = User::where('api_token', $token)->first();
            if ($user) {
                auth()->login($user);
                $request->setUserResolver(fn() => $user);
                return $next($request);
            }
        }

        return response()->json(['message' => 'Unauthenticated'], 401);
    }
}
