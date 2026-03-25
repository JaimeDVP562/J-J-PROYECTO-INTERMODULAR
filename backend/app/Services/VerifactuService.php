<?php

namespace App\Services;

use App\Models\Factura;
use App\Models\Empresa;

class VerifactuService
{
    /**
     * Build the payload expected by Verifactu from a Factura instance.
     */
    public function buildPayload(Factura $factura): array
    {
        $empresa = Empresa::first();

        $lineas = [];
        foreach ($factura->detalles ?? [] as $d) {
            $lineas[] = [
                'descripcion' => $d->producto?->nombre ?? 'Item',
                'cantidad' => (float) $d->cantidad,
                'precio_unitario' => (float) $d->precio_unitario,
                'subtotal' => (float) ($d->cantidad * $d->precio_unitario),
            ];
        }

        $payload = [
            'emisor' => [
                'nif' => $empresa?->nif,
                'nombre' => $empresa?->nombre_fiscal,
                'iban' => $empresa?->iban,
                'direccion' => $empresa?->direccion,
            ],
            'receptor' => [
                'cliente_id' => $factura->cliente_id,
                'nombre' => $factura->cliente?->nombre ?? null,
            ],
            'factura' => [
                'series' => $factura->series,
                'number' => $factura->number,
                'invoice_date' => $factura->invoice_date,
                'due_date' => $factura->due_date,
                'total_amount' => (float) $factura->total_amount,
                'tax_breakdown' => $factura->tax_breakdown,
                'line_items' => $lineas,
            ],
        ];

        return $payload;
    }

    /**
     * Send factura to Verifactu (stubbed).
     * For now this method builds payload and stores a mock response in factura->verifactu.
     */
    public function send(Factura $factura): array
    {
        $payload = $this->buildPayload($factura);

        // TODO: implement real HTTP call to Verifactu sandbox with credentials
        $mockResponse = [
            'status' => 'ok',
            'message' => 'Simulated send to Verifactu',
            'payload_summary' => [
                'total' => $payload['factura']['total_amount'] ?? 0,
                'lines' => count($payload['factura']['line_items'] ?? []),
            ],
        ];

        $factura->verifactu = $mockResponse;
        $factura->save();

        return $mockResponse;
    }
}
