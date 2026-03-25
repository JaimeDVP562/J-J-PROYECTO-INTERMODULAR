<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use App\Models\Empresa;
use App\Http\Resources\FacturaResource;
use App\Services\VerifactuService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FacturaController extends Controller
{
    public function index()
    {
        $facturas = Factura::with('cliente', 'user', 'detalles', 'proveedor')->get();
        return FacturaResource::collection($facturas);
    }

    public function store(Request $request)
    {
        // Validate only fields required by Verifactu payload + detalles
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'user_id' => 'required|exists:users,id',
            'series' => 'nullable|string',
            'number' => 'nullable|integer',
            'invoice_date' => 'required|date',
            'due_date' => 'nullable|date',
            'total_amount' => 'required|numeric',
            'tax_breakdown' => 'nullable|array',
            // detalles (line items)
            'detalles' => 'nullable|array',
            'detalles.*.producto_id' => 'required_with:detalles|exists:productos,id',
            'detalles.*.cantidad' => 'required_with:detalles|integer|min:1',
            'detalles.*.precio_unitario' => 'required_with:detalles|numeric|min:0',
            'detalles.*.descripcion' => 'nullable|string',
        ]);

        // Wrap creation in a transaction and use an atomic counter to avoid race conditions
        try {
            $result = DB::transaction(function () use ($validated) {
                // Determine series: prefer provided value, otherwise company default, fallback 'F'
                if (array_key_exists('series', $validated) && $validated['series'] !== null && trim((string)$validated['series']) !== '') {
                    $series = trim((string)$validated['series']);
                } else {
                    $empresa = Empresa::first();
                    $series = 'F';
                    if ($empresa && is_array($empresa->extra) && array_key_exists('default_series', $empresa->extra)) {
                        $candidate = trim((string)($empresa->extra['default_series'] ?? ''));
                        if ($candidate !== '') $series = $candidate;
                    }
                }

                $dataToCreate = $validated;
                // If number not provided, allocate atomically using invoice_counters
                if (!array_key_exists('number', $dataToCreate) || $dataToCreate['number'] === null) {
                    $row = DB::table('invoice_counters')->where('series', $series)->lockForUpdate()->first();
                    if ($row) {
                        $new = (int)$row->last + 1;
                        DB::table('invoice_counters')->where('series', $series)->update(['last' => $new, 'updated_at' => now()]);
                        $dataToCreate['number'] = $new;
                    } else {
                        // initialize from existing facturas to be safe
                        $last = DB::table('facturas')->where('series', $series)->max('number');
                        $last = $last === null ? 0 : (int)$last;
                        $new = $last + 1;
                        DB::table('invoice_counters')->insert(['series' => $series, 'last' => $new, 'created_at' => now(), 'updated_at' => now()]);
                        $dataToCreate['number'] = $new;
                    }
                } else {
                    $dataToCreate['number'] = (int)$dataToCreate['number'];
                }

                $dataToCreate['series'] = $series;

                // Ensure uniqueness (defensive)
                $conflict = Factura::where('series', $dataToCreate['series'])
                    ->where('number', $dataToCreate['number'])
                    ->exists();
                if ($conflict) {
                    throw new \Exception('Otra factura ya usa esa serie y número');
                }

                $detalles = $dataToCreate['detalles'] ?? null;
                if (isset($dataToCreate['detalles'])) unset($dataToCreate['detalles']);

                if (!isset($dataToCreate['status'])) $dataToCreate['status'] = 'pending';

                $factura = Factura::create($dataToCreate);

                if (is_array($detalles) && count($detalles) > 0) {
                    foreach ($detalles as $d) {
                        $cantidad = (int)($d['cantidad'] ?? 0);
                        $precio = (float)($d['precio_unitario'] ?? 0);
                        $subtotal = $cantidad * $precio;
                        $factura->detalles()->create([
                            'producto_id' => $d['producto_id'],
                            'cantidad' => $cantidad,
                            'precio_unitario' => $precio,
                            'subtotal' => $subtotal,
                        ]);
                    }
                    $factura->load('detalles', 'cliente');
                }

                return $factura;
            });

            $factura = $result;
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        // Attempt to send to Verifactu (non-blocking for now)
        try {
            $service = new VerifactuService();
            $service->send($factura->fresh());
        } catch (\Throwable $e) {
            // Log but do not prevent response
            \Log::error('Verifactu send failed: ' . $e->getMessage());
        }

        return response()->json([
            'mensaje' => 'Factura creada con éxito',
            'data' => new FacturaResource($factura->fresh())
        ], 201);
    }

    public function show($id)
    {
        $factura = Factura::with('cliente', 'user', 'detalles')->find($id);
        if (!$factura) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return new FacturaResource($factura);
    }

    public function update(Request $request, $id)
    {
        $factura = Factura::find($id);
        if (!$factura) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'proveedor_id' => 'nullable|exists:proveedores,id',
            'user_id' => 'required|exists:users,id',
            'series' => 'nullable|string',
            'number' => 'nullable|integer',
            'invoice_id' => 'nullable|string',
            'issue_date' => 'nullable|date',
            'operation_date' => 'nullable|date',
            'invoice_type' => 'nullable|string',
            'rectified_invoice' => 'nullable|string',
            'total_amount' => 'required|numeric',
            'gross_amount' => 'nullable|numeric',
            'tax_amount' => 'nullable|numeric',
            'tax_breakdown' => 'nullable|array',
            'status' => 'required|string|in:pending,paid,cancelled,draft,issued,sent,accepted,rejected',
            'invoice_date' => 'required|date',
            'due_date' => 'nullable|date',
            'payment_method' => 'nullable|string',
            'payment_due_date' => 'nullable|date',
            'iban' => 'nullable|string',
            'verifactu' => 'nullable|array',
        ]);

        // If series/number are being changed, ensure uniqueness
        if (array_key_exists('series', $validated) || array_key_exists('number', $validated)) {
            $newSeries = array_key_exists('series', $validated) && $validated['series'] !== null
                ? trim((string)$validated['series'])
                : $factura->series;
            $newNumber = array_key_exists('number', $validated) && $validated['number'] !== null
                ? (int)$validated['number']
                : $factura->number;

            $conflict = Factura::where('series', $newSeries)
                ->where('number', $newNumber)
                ->where('id', '!=', $factura->id)
                ->exists();
            if ($conflict) {
                return response()->json(['message' => 'Otra factura ya usa esa serie y número'], 422);
            }
            $validated['series'] = $newSeries;
            $validated['number'] = $newNumber;
        }

        $factura->update($validated);

        return response()->json([
            'mensaje' => 'Factura actualizada con éxito',
            'data' => new FacturaResource($factura)
        ]);
    }

    public function destroy($id)
    {
        $factura = Factura::find($id);
        if (!$factura) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $factura->delete();

        return response()->json(['mensaje' => 'Factura eliminada con éxito']);
    }

    /**
     * Re-send an existing factura to Verifactu (uses the existing VerifactuService stub).
     */
    public function resendVerifactu($id)
    {
        $factura = Factura::find($id);
        if (!$factura) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        try {
            $service = new VerifactuService();
            $service->send($factura->fresh());
        } catch (\Throwable $e) {
            \Log::error('Verifactu resend failed: ' . $e->getMessage());
            return response()->json(['error' => 'Error al reenviar a Verifactu'], 500);
        }

        return response()->json([
            'mensaje' => 'Factura reenviada a Verifactu',
            'data' => new FacturaResource($factura->fresh())
        ]);
    }

    /**
     * Return next sequential invoice number for a given series.
     * Query param: series (optional)
     */
    public function nextNumber(Request $request)
    {
        $seriesParam = $request->query('series', null);

        // Determine series same as store(): prefer provided, otherwise company default, fallback 'F'
        if ($seriesParam !== null && trim((string)$seriesParam) !== '') {
            $series = trim((string)$seriesParam);
        } else {
            $empresa = Empresa::first();
            $series = 'F';
            if ($empresa && is_array($empresa->extra) && array_key_exists('default_series', $empresa->extra)) {
                $candidate = trim((string)($empresa->extra['default_series'] ?? ''));
                if ($candidate !== '') $series = $candidate;
            }
        }

        // Prefer invoice_counters table (atomic), but fall back to max+1 if not present
        if (Schema::hasTable('invoice_counters')) {
            $row = DB::table('invoice_counters')->where('series', $series)->first();
            if ($row) {
                $next = (int)$row->last + 1;
                return response()->json(['series' => $series, 'next' => $next]);
            }
        }

        $last = Factura::where('series', $series)->max('number');
        $next = $last === null ? 1 : (int)$last + 1;

        return response()->json(['series' => $series, 'next' => $next]);
    }
}
