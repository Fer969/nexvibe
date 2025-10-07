# 🎨 Cómo agregar Favicon

Un favicon es el pequeño ícono que aparece en la pestaña del navegador.

## 📋 Pasos para crear y agregar el favicon:

### Opción 1: Generador automático (Recomendado)

1. Ve a [Favicon.io](https://favicon.io/favicon-converter/)
2. Sube tu archivo `logo.png`
3. Descarga el paquete generado
4. Extrae los archivos en esta carpeta `images/logo/`

Los archivos que obtendrás:
- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png`

### Opción 2: Usar tu logo directamente

Si tu logo ya está en formato cuadrado (ej: 512x512px):
- Renombra una copia a `favicon.png`

## 🔧 Agregar al sitio

Abre `index.html` y agrega estas líneas en el `<head>` (después de la línea 7):

```html
<!-- Favicons -->
<link rel="icon" type="image/png" sizes="32x32" href="images/logo/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="images/logo/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="images/logo/apple-touch-icon.png">
<link rel="icon" type="image/x-icon" href="images/logo/favicon.ico">
```

## ✅ Verificar

1. Guarda los cambios
2. Recarga la página en tu navegador
3. Deberías ver tu logo en la pestaña del navegador

---

**Nota:** Si el favicon no aparece inmediatamente, prueba:
- Ctrl + F5 (Windows) o Cmd + Shift + R (Mac) para recargar sin caché
- Cerrar y abrir el navegador

