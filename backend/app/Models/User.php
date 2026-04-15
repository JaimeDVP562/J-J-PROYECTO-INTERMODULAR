<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * @deprecated Use Sanctum: $user->createToken('api-token')->plainTextToken
     * Kept for backwards-compatibility during migration.
     */
    public function createApiToken(): string
    {
        $this->api_token = Str::random(60);
        $this->api_token_expires_at = now()->addHours(12);
        $this->save();
        return $this->api_token;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nombre',
        'apellido',
        'email',
        'password',
        'rol',
        'photo',
        'telefono',
        'puesto',
        'salario',
        'fecha_contratacion',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'api_token',
        'api_token_expires_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at'     => 'datetime',
            'api_token_expires_at'  => 'datetime',
            'password'              => 'hashed',
        ];
    }
}
