# 📦 Sistema de Gestión de Productos - NEXVIBE

## 🎯 Cómo Funciona el Sistema

Tu tienda ahora carga **todos los productos dinámicamente** desde el archivo `config.json`. Esto significa que:

✅ **NO necesitas editar el HTML** para agregar/quitar productos  
✅ **Solo editas el archivo JSON** con los datos de tus productos  
✅ **El inventario se controla desde un solo lugar**  
✅ **Puedes activar/desactivar productos sin eliminarlos**

---

## 📝 Cómo Agregar un Nuevo Producto

### Paso 1: Abre el archivo `config.json`

### Paso 2: Ve a la sección `"productos"` y agrega un nuevo producto con esta estructura:

```json
{
  "id": "producto-unico-001",
  "nombre": "Nombre del Producto",
  "descripcion": "Descripción breve del producto",
  "precio": 95000,
  "stock": 20,
  "imagen": "images/productos/nombre_imagen.png",
  "badge": "Nuevo",
  "categoria": "camisetas",
  "tallas": ["S", "M", "L", "XL", "XXL"],
  "colores": ["negro", "blanco"],
  "activo": true
}
```

### Paso 3: Guarda el archivo

¡Listo! El producto aparecerá automáticamente en tu tienda.

---

## 🔧 Explicación de Cada Campo

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **id** | Identificador único del producto (usa letras, números y guiones) | `"camiseta-roja-001"` |
| **nombre** | Nombre que verá el cliente | `"Camiseta Roja Oversize"` |
| **descripcion** | Descripción corta del producto | `"Camiseta 100% algodón"` |
| **precio** | Precio en números SIN puntos ni comas | `85000` (no `"$85.000"`) |
| **stock** | Cantidad disponible en inventario | `25` |
| **imagen** | Ruta de la imagen del producto | `"images/productos/camiseta.png"` |
| **badge** | Etiqueta promocional (opcional) | `"Nuevo"`, `"Hot"`, o `null` |
| **categoria** | Tipo de producto | `"camisetas"`, `"sudaderas"`, `"accesorios"` |
| **tallas** | Array de tallas disponibles | `["S", "M", "L", "XL"]` |
| **colores** | Array de colores disponibles | `["negro", "blanco", "gris"]` |
| **activo** | Si el producto está visible o no | `true` o `false` |

---

## 📊 Control de Inventario

### Niveles de Stock:

- **Stock > 10 unidades**: Badge verde "Disponible"
- **Stock ≤ 10 unidades**: Badge naranja con número de unidades (ej: "5 unidades")
- **Stock = 0**: Badge rojo "Agotado" + botón deshabilitado

### Para actualizar el stock:

Simplemente cambia el número en el campo `"stock"`:

```json
{
  "id": "camiseta-negra-001",
  "nombre": "Camiseta Negra Oversize",
  "stock": 15,    ← Cambia este número
  ...
}
```

---

## 🔄 Cómo Editar un Producto Existente

1. Abre `config.json`
2. Busca el producto por su `id` o `nombre`
3. Cambia los campos que necesites
4. Guarda el archivo
5. Recarga la página web

**Ejemplo:** Para cambiar el precio de una camiseta:

```json
{
  "id": "camiseta-negra-001",
  "nombre": "Camiseta Negra Oversize",
  "descripcion": "Camiseta oversize 100% algodón",
  "precio": 90000,  ← Era 85000, ahora es 90000
  ...
}
```

---

## 🗑️ Cómo Ocultar/Eliminar un Producto

### Opción 1: Ocultar temporalmente (recomendado)
Cambia `"activo": true` a `"activo": false`:

```json
{
  "id": "camiseta-blanca-001",
  "activo": false  ← El producto ya no se mostrará
}
```

### Opción 2: Eliminar permanentemente
Borra todo el bloque del producto del JSON (incluyendo las llaves `{ }`).

**⚠️ Importante:** No olvides eliminar la coma si es el último producto de la lista.

---

## 🎨 Badges Disponibles

Los badges son las etiquetas que aparecen en las esquinas de los productos:

| Badge | Color | Cuándo usar |
|-------|-------|-------------|
| `"Nuevo"` | Azul eléctrico | Productos recién agregados |
| `"Hot"` | Verde lima | Productos más vendidos |
| `null` | Sin badge | Productos regulares |

```json
"badge": "Nuevo"   ← Con badge
"badge": null      ← Sin badge
```

---

## 📸 Cómo Agregar Imágenes de Productos

1. **Guarda tu imagen** en la carpeta `images/productos/`
2. **Nombre recomendado:** usa minúsculas y guiones bajos
   - ✅ `camiseta_azul.png`
   - ❌ `Camiseta Azul.PNG`

3. **En el JSON** usa la ruta completa:
   ```json
   "imagen": "images/productos/camiseta_azul.png"
   ```

4. **Formato recomendado:** PNG o JPG con fondo blanco o transparente

---

## 🚀 Ejemplo Completo: Agregar una Chaqueta Nueva

```json
{
  "productos": [
    ... productos existentes ...
    ,
    {
      "id": "chaqueta-bomber-001",
      "nombre": "Chaqueta Bomber Premium",
      "descripcion": "Chaqueta bomber con forro interior",
      "precio": 180000,
      "stock": 12,
      "imagen": "images/productos/chaqueta_bomber.png",
      "badge": "Nuevo",
      "categoria": "chaquetas",
      "tallas": ["S", "M", "L", "XL"],
      "colores": ["negro", "verde militar"],
      "activo": true
    }
  ]
}
```

---

## ⚠️ Limitaciones del Sistema Actual

### ✅ Lo que SÍ hace:
- Carga productos dinámicamente desde JSON
- Muestra estado de inventario en tiempo real
- Previene compras de productos agotados
- Interfaz fácil de actualizar

### ❌ Lo que NO hace (requiere backend):
- **NO actualiza el stock automáticamente** cuando alguien compra
- **NO sincroniza** el inventario entre múltiples usuarios
- **NO guarda** las compras en una base de datos
- **NO procesa** pagos automáticamente

### 🔥 Para un sistema completamente funcional necesitas:

1. **Backend** (servidor con Node.js, PHP, Python, etc.)
2. **Base de datos** (MySQL, MongoDB, Firebase, etc.)
3. **Sistema de pagos** (integración con pasarelas de pago)
4. **Panel administrativo** para gestionar productos visualmente

---

## 🎯 Opciones para Sistema Real

### Opción 1: Shopify / WooCommerce
- **Pros:** Todo incluido, fácil de usar
- **Contras:** Costo mensual

### Opción 2: Backend personalizado
- **Pros:** Control total, sin costos mensuales
- **Contras:** Requiere desarrollo

### Opción 3: Firebase (Recomendado para empezar)
- **Pros:** Gratis hasta cierto límite, tiempo real
- **Contras:** Requiere aprender Firebase

---

## 📞 Workflow Actual de Ventas

**Cómo funcionan las ventas ahora:**

1. Cliente ve los productos y agrega al carrito
2. Hace clic en "Finalizar compra"
3. Se abre WhatsApp con el pedido
4. **TÚ manualmente:**
   - Confirmas disponibilidad
   - Procesas el pago
   - **IMPORTANTE: Actualizas el stock en `config.json`**
   - Envías el producto

**Ejemplo:** Si vendes 2 camisetas negras:
```json
{
  "id": "camiseta-negra-001",
  "stock": 25  ← Era 27, vendiste 2, cambias a 25
}
```

---

## 🔒 Respaldo de Datos

**IMPORTANTE:** Siempre guarda una copia de seguridad de `config.json` antes de editarlo.

**Recomendación:** Usa Control de Versiones (Git) para mantener historial de cambios.

---

## 💡 Consejos Pro

1. **Actualiza el stock** después de cada venta
2. **Usa IDs únicos** para cada producto
3. **Optimiza las imágenes** (máximo 500KB por imagen)
4. **Mantén descripciones cortas** (máximo 100 caracteres)
5. **Revisa el JSON** en un validador online antes de guardar

### Validador JSON recomendado:
🔗 https://jsonlint.com/

---

## 📚 Recursos Adicionales

- **PERSONALIZACION.md** - Guía para personalizar colores y estilos
- **README.md** - Información general del proyecto
- **config.json** - Archivo principal de configuración

---

## 🆘 Preguntas Frecuentes

### ¿Puedo agregar más de 5 productos?
**Sí**, agrega tantos como quieras en el array de productos.

### ¿Se puede mostrar productos en categorías?
**Sí**, el campo `categoria` ya está preparado para filtros futuros.

### ¿Cómo sé si el JSON está correcto?
Usa jsonlint.com para validar antes de guardar.

### ¿Qué pasa si el JSON tiene un error?
La página mostrará "Error al cargar los productos".

---

**🚀 ¡Listo! Ahora tienes control total sobre tu inventario desde un solo archivo.**

