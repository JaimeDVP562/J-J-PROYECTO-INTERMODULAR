<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AyudaController extends Controller
{
    public function enviar(Request $request)
    {
        $validated = $request->validate([
            'empresa'     => 'required|string|max:255',
            'descripcion' => 'required|string|max:2000',
        ]);

        $remitente = $request->user();

        try {
            Mail::raw(
                "Incidencia recibida desde el ERP\n\n" .
                "Empresa: {$validated['empresa']}\n" .
                "Usuario: {$remitente->nombre} ({$remitente->email})\n\n" .
                "Descripción:\n{$validated['descripcion']}",
                function ($message) use ($validated, $remitente) {
                    $message->to('jjproyect@gmail.com')
                            ->from($remitente->email, $remitente->nombre)
                            ->subject("Incidencia ERP - {$validated['empresa']}");
                }
            );

            return response()->json(['mensaje' => 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al enviar el mensaje. Inténtalo de nuevo más tarde.'], 500);
        }
    }
}
