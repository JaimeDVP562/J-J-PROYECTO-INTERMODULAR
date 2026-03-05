<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class PerfilController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'id'         => $user->id,
            'nombre'     => $user->nombre,
            'email'      => $user->email,
            'rol'        => $user->rol,
            'photo'      => $user->photo ? asset('storage/' . $user->photo) : null,
            'created_at' => $user->created_at,
        ]);
    }

    /**
     * Admin puede ver el perfil de cualquier usuario.
     */
    public function showById(Request $request, $id)
    {
        if ($request->user()->rol !== 'admin') {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $user = \App\Models\User::findOrFail($id);
        return response()->json([
            'id'         => $user->id,
            'nombre'     => $user->nombre,
            'email'      => $user->email,
            'rol'        => $user->rol,
            'photo'      => $user->photo ? asset('storage/' . $user->photo) : null,
            'created_at' => $user->created_at,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nombre'   => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'photo'    => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('photo')) {
            // Remove old photo
            if ($user->photo) {
                Storage::disk('public')->delete($user->photo);
            }
            $path = $request->file('photo')->store('photos', 'public');
            $validated['photo'] = $path;
        }

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'mensaje' => 'Perfil actualizado correctamente.',
            'data'    => [
                'id'         => $user->id,
                'nombre'     => $user->nombre,
                'email'      => $user->email,
                'rol'        => $user->rol,
                'photo'      => $user->photo ? asset('storage/' . $user->photo) : null,
                'created_at' => $user->created_at,
            ],
        ]);
    }
}
