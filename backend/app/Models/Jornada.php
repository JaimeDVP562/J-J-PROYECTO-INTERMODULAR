<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jornada extends Model
{
    use HasFactory;

    protected $table = 'jornadas';
    protected $fillable = ['user_id', 'inicio', 'fin'];

    protected $casts = [
        'inicio' => 'datetime',
        'fin'    => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getDuracionMinutosAttribute(): ?int
    {
        if (!$this->fin) return null;
        return (int) $this->inicio->diffInMinutes($this->fin);
    }
}
