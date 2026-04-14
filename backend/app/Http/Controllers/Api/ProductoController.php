<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Productos", description="CRUD de productos del catálogo")
 */
class ProductoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/productos",
     *     summary="Listar todos los productos",
     *     tags={"Productos"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de productos",
     *         @OA\JsonContent(type="array", @OA\Items(
     *             @OA\Property(property="id",             type="integer"),
     *             @OA\Property(property="nombre",         type="string"),
     *             @OA\Property(property="sku",            type="string"),
     *             @OA\Property(property="precio",         type="number"),
     *             @OA\Property(property="stock_quantity", type="integer"),
     *             @OA\Property(property="categoria",      type="object"),
     *             @OA\Property(property="proveedor",      type="object")
     *         ))
     *     ),
     *     @OA\Response(response=401, description="No autenticado")
     * )
     */
    public function index()
    {
        $productos = \App\Models\Producto::with('categoria', 'proveedor')->get();
        return \App\Http\Resources\ProductoResource::collection($productos);
    }

    /**
     * @OA\Post(
     *     path="/api/productos",
     *     summary="Crear un nuevo producto",
     *     tags={"Productos"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nombre","precio","stock_quantity","proveedor_id"},
     *             @OA\Property(property="nombre",         type="string",  example="Café Espresso"),
     *             @OA\Property(property="sku",            type="string",  example="CAF-001"),
     *             @OA\Property(property="descripcion",    type="string"),
     *             @OA\Property(property="precio",         type="number",  example=2.50),
     *             @OA\Property(property="stock_quantity", type="integer", example=100),
     *             @OA\Property(property="categoria_id",   type="integer"),
     *             @OA\Property(property="proveedor_id",   type="integer")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Producto creado"),
     *     @OA\Response(response=422, description="Datos inválidos"),
     *     @OA\Response(response=401, description="No autenticado")
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'         => 'required|string|max:255|unique:productos,nombre',
            'sku'            => 'nullable|string|max:100|unique:productos,sku',
            'descripcion'    => 'nullable|string',
            'precio'         => 'required|numeric',
            'stock_quantity' => 'required|integer|min:0',
            'categoria_id'   => 'nullable|exists:categorias,id',
            'proveedor_id'   => 'required|exists:proveedores,id',
        ]);

        $producto = \App\Models\Producto::create($validated);

        return response()->json([
            'mensaje' => 'Producto creado con éxito',
            'data'    => new \App\Http\Resources\ProductoResource($producto),
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/productos/{id}",
     *     summary="Obtener un producto por ID",
     *     tags={"Productos"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Producto encontrado"),
     *     @OA\Response(response=404, description="No encontrado"),
     *     @OA\Response(response=401, description="No autenticado")
     * )
     */
    public function show(string $id)
    {
        $producto = \App\Models\Producto::with('categoria', 'proveedor')->find($id);
        if (!$producto) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return new \App\Http\Resources\ProductoResource($producto);
    }

    /**
     * @OA\Put(
     *     path="/api/productos/{id}",
     *     summary="Actualizar un producto",
     *     tags={"Productos"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="nombre",         type="string"),
     *             @OA\Property(property="precio",         type="number"),
     *             @OA\Property(property="stock_quantity", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Actualizado"),
     *     @OA\Response(response=404, description="No encontrado"),
     *     @OA\Response(response=401, description="No autenticado")
     * )
     */
    public function update(Request $request, string $id)
    {
        $producto = \App\Models\Producto::find($id);
        if (!$producto) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $validated = $request->validate([
            'nombre'         => 'sometimes|string|max:255|unique:productos,nombre,' . $id,
            'sku'            => 'nullable|string|max:100|unique:productos,sku,' . $id,
            'descripcion'    => 'nullable|string',
            'precio'         => 'sometimes|numeric',
            'stock_quantity' => 'sometimes|integer|min:0',
            'categoria_id'   => 'nullable|exists:categorias,id',
            'proveedor_id'   => 'sometimes|exists:proveedores,id',
        ]);

        $producto->update($validated);

        return response()->json([
            'mensaje' => 'Actualizado correctamente',
            'data'    => new \App\Http\Resources\ProductoResource($producto),
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/productos/{id}",
     *     summary="Eliminar un producto",
     *     tags={"Productos"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Eliminado"),
     *     @OA\Response(response=404, description="No encontrado"),
     *     @OA\Response(response=401, description="No autenticado")
     * )
     */
    public function destroy(string $id)
    {
        $producto = \App\Models\Producto::find($id);
        if (!$producto) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $producto->delete();

        return response()->json(['mensaje' => 'Eliminado correctamente']);
    }
}
