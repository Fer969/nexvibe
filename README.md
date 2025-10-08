# NEXVIBE. 🔥

**La nueva vibra del streetwear**

Tienda online moderna y minimalista para la marca de ropa urbana NEXVIBE. Ropa oversize, básica y con actitud, hecha en Colombia.

![NEXVIBE](https://img.shields.io/badge/NEXVIBE-Streetwear-00AEEF?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-C6FF00?style=for-the-badge)
![Made in Colombia](https://img.shields.io/badge/Made%20in-Colombia-FCD116?style=for-the-badge)

---

## 🎯 Características

- ✨ **Diseño minimalista y limpio** con alto contraste
- 🎨 **Paleta de colores moderna**: Negro, blanco, gris humo con acentos en azul eléctrico y verde lima
- 📱 **Totalmente responsive** - Perfecto en todos los dispositivos
- 🛒 **Carrito de compras funcional** con persistencia en localStorage
- 💬 **Integración con WhatsApp** para pedidos directos
- 🎭 **Animaciones suaves** y efectos de scroll modernos
- ⚡ **Carga rápida** y optimizado para rendimiento
- 🌐 **SEO optimizado** con meta tags apropiados

---

## 🚀 Inicio Rápido

### Opción 1: Abrir directamente (Recomendado)

1. Descarga o clona este repositorio
2. Abre el archivo `index.html` en tu navegador favorito
3. ¡Listo! El sitio está funcionando

### Opción 2: Con servidor local

```bash
# Usando Python 3
python -m http.server 8000

# Usando PHP
php -S localhost:8000

# Usando Node.js (si tienes http-server instalado)
npx http-server

# Usando Visual Studio Code
# Instala la extensión "Live Server" y haz clic derecho en index.html > "Open with Live Server"
```

Luego visita: `http://localhost:8000`

---

## 📁 Estructura del Proyecto

```
nexvibe_website/
│
├── index.html          # Página principal con todas las secciones
├── styles.css          # Estilos minimalistas y modernos
├── script.js           # Funcionalidad e interactividad
├── config.json         # Configuración del sitio
├── .gitignore          # Archivos ignorados por Git
└── README.md           # Este archivo
```

---

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Negro | `#000000` | Texto principal, fondos |
| Blanco | `#FFFFFF` | Fondos, texto invertido |
| Gris Humo | `#F5F5F5` | Fondos secundarios |
| Azul Eléctrico | `#00AEEF` | Acentos, botones, enlaces |
| Verde Lima | `#C6FF00` | Acentos especiales, badges |

---

## 🔧 Personalización

### Cambiar información de contacto

Edita el archivo `config.json`:

```json
{
  "contact": {
    "whatsapp": "+1234567",  // Tu número de WhatsApp
    "email": "hola@nexvibe.co",   // Tu email
    "instagram": "@nexvibe.co"    // Tu usuario de Instagram
  }
}
```

También actualiza los enlaces en `index.html`:

- Busca `1234567` y reemplázalo con tu número de WhatsApp (con código de país)
- Actualiza los enlaces de redes sociales en el header y footer

### Agregar productos

**¡NUEVO!** Los productos ahora se gestionan desde `config.json`. 

Ver documentación completa en **GESTION_PRODUCTOS.md**

Estructura básica:

```json
{
  "id": "producto-001",
  "nombre": "Nombre del Producto",
  "descripcion": "Descripción breve",
  "precio": 85000,
  "stock": 25,
  "imagen": "images/productos/imagen.png",
  "badge": "Nuevo",
  "categoria": "camisetas",
  "tallas": ["S", "M", "L", "XL"],
  "colores": ["negro", "blanco"],
  "activo": true
}
```

### Reemplazar imágenes placeholder

Actualmente el sitio usa placeholders con iconos. Para agregar imágenes reales:

1. Crea una carpeta `images/` en la raíz del proyecto
2. Agrega tus imágenes (productos, hero, galería, etc.)
3. Reemplaza los `<div class="producto-placeholder">` por:

```html
<img src="images/nombre-producto.jpg" alt="Nombre del Producto">
```

**Recomendaciones de imágenes:**
- Formato: JPG o WebP
- Tamaño de productos: 800x1000px (ratio 3:4)
- Tamaño hero: 1920x1080px mínimo
- Peso: Optimizar a menos de 200KB por imagen

### Cambiar tipografía

En `index.html`, actualiza el enlace de Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Tu+Fuente:wght@300;400;600;700;900&display=swap" rel="stylesheet">
```

En `styles.css`, actualiza la variable:

```css
:root {
    --font-primary: 'Tu Fuente', sans-serif;
}
```

---

## 📦 Sistema de Inventario Dinámico (NUEVO)

**¡Ahora puedes gestionar todos tus productos desde un solo archivo JSON!**

### Características:
- ✅ **Carga dinámica** de productos desde `config.json`
- ✅ **Control de inventario** en tiempo real
  - 🟢 Verde "Disponible" (más de 10 unidades)
  - 🟠 Naranja "Pocas unidades" (10 o menos)
  - 🔴 Rojo "Agotado" (0 unidades)
- ✅ **Validación automática** de stock antes de comprar
- ✅ **Indicadores visuales** en tarjetas y modal
- ✅ **Bloqueo de compras** para productos agotados

### Cómo agregar/editar productos:

1. Abre `config.json`
2. Busca la sección `"productos"`
3. Agrega o edita productos con este formato:

```json
{
  "id": "producto-001",
  "nombre": "Nombre del Producto",
  "descripcion": "Descripción breve",
  "precio": 85000,
  "stock": 25,
  "imagen": "images/productos/imagen.png",
  "badge": "Nuevo",
  "categoria": "camisetas",
  "tallas": ["S", "M", "L", "XL"],
  "colores": ["negro", "blanco"],
  "activo": true
}
```

4. Guarda y recarga la página

### Documentación completa:
- 📚 **GESTION_PRODUCTOS.md** - Guía detallada paso a paso
- 📝 **EJEMPLO_AGREGAR_PRODUCTO.json** - Plantilla con ejemplos

### ⚠️ Importante:
Este sistema **muestra** el inventario pero **NO actualiza automáticamente** cuando se vende. 
Debes actualizar manualmente el campo `"stock"` en `config.json` después de cada venta.

---

## 🛒 Sistema de Carrito

El carrito de compras incluye:

- ✅ Agregar productos
- ✅ Eliminar productos
- ✅ Contador de items
- ✅ Cálculo automático del total
- ✅ Persistencia con localStorage (se mantiene al recargar)
- ✅ Botón de checkout que envía el pedido por WhatsApp
- ✅ **NUEVO:** Validación de stock antes de agregar

### Flujo de compra

1. Usuario agrega productos al carrito (se valida el stock)
2. Revisa el carrito haciendo clic en el ícono del carrito
3. Hace clic en "Finalizar compra"
4. Se abre WhatsApp con el pedido pre-formateado
5. Usuario completa el pedido por WhatsApp
6. **TÚ actualizas el stock en `config.json` manualmente**

---

## 📱 Responsive Design

El sitio se adapta perfectamente a:

- 📱 Móviles (320px - 767px)
- 📱 Tablets (768px - 1024px)
- 💻 Laptops (1025px - 1440px)
- 🖥️ Monitores grandes (1441px+)

---

## ⚡ Características Técnicas

### HTML5
- Estructura semántica
- Meta tags para SEO
- Open Graph para redes sociales (puedes agregarlos)

### CSS3
- Variables CSS personalizadas
- Flexbox y CSS Grid
- Animaciones y transiciones suaves
- Media queries para responsive

### JavaScript Vanilla
- Sin dependencias externas
- Código modular y comentado
- Event delegation
- LocalStorage API
- Intersection Observer API

---

## 🌐 SEO y Rendimiento

### Optimizaciones incluidas:
- ✅ Meta descripción
- ✅ Título optimizado
- ✅ Estructura de headings correcta (H1, H2, H3)
- ✅ Alt text en iconos (agregar a imágenes cuando se incluyan)
- ✅ Smooth scroll
- ✅ CSS y JS optimizados
- ✅ Carga de fuentes optimizada

### Optimizaciones recomendadas:
- [ ] Agregar favicon
- [ ] Agregar meta tags de Open Graph
- [ ] Comprimir imágenes
- [ ] Implementar lazy loading para imágenes
- [ ] Agregar Service Worker para PWA
- [ ] Configurar Google Analytics

---

## 🚀 Deployment

### GitHub Pages

1. Sube el proyecto a un repositorio de GitHub
2. Ve a Settings > Pages
3. Selecciona la rama `main` y la carpeta raíz `/`
4. Tu sitio estará en `https://tuusuario.github.io/nexvibe_website`

### Netlify

1. Arrastra la carpeta del proyecto a [Netlify Drop](https://app.netlify.com/drop)
2. Tu sitio estará online en segundos
3. Obtén un dominio personalizado gratuito

### Vercel

```bash
# Instala Vercel CLI
npm i -g vercel

# Despliega
vercel
```

### Hosting tradicional

1. Conecta por FTP a tu hosting
2. Sube todos los archivos a la carpeta `public_html` o `www`
3. Accede a tu dominio

---

## 🔄 Actualización y Mantenimiento

### Actualizar productos

**¡Ahora es mucho más fácil!** Solo edita `config.json`:

1. Para **agregar** un producto: Agrega un nuevo objeto al array `productos`
2. Para **editar** un producto: Cambia los valores del producto existente
3. Para **ocultar** un producto: Cambia `"activo": false`
4. Para **eliminar** un producto: Borra el objeto completo

### Actualizar precios

Edita el campo `"precio"` en `config.json`:

```json
{
  "id": "camiseta-001",
  "precio": 95000  ← Cambia este valor
}
```

### Actualizar stock

Después de cada venta, actualiza el campo `"stock"`:

```json
{
  "id": "camiseta-001",
  "stock": 23  ← Resta las unidades vendidas
}
```

### Cambiar contenido

Todo el contenido es editable directamente en `index.html`. Busca las secciones:
- Hero section
- Productos destacados
- Sobre nosotros
- Galería
- Contacto
- Footer

---

## 📞 Soporte y Contacto

¿Tienes preguntas o necesitas ayuda?

- 📧 Email: hola@nexvibe.co
- 📱 WhatsApp: +57 300 123 4567
- 📸 Instagram: [@nexvibe.co](https://instagram.com/nexvibe.co)

---

## 📄 Licencia

Este proyecto es de uso libre para NEXVIBE. Si deseas usar este código para tu propio proyecto, por favor da crédito apropiado.

---

## 🎯 Roadmap

Mejoras futuras planeadas:

- [ ] Panel de administración para gestionar productos
- [ ] Sistema de tallas y colores
- [ ] Integración con pasarela de pagos
- [ ] Galería de Instagram en tiempo real
- [ ] Sistema de reviews y calificaciones
- [ ] Blog/lookbook de moda
- [ ] Modo oscuro
- [ ] Versión en inglés

---

## 🙏 Agradecimientos

Diseñado y desarrollado con ❤️ para NEXVIBE

**Tecnologías utilizadas:**
- HTML5
- CSS3
- JavaScript ES6
- Font Awesome 6
- Google Fonts (Montserrat)

---

## 💡 Tips y Mejores Prácticas

### Para fotografía de productos:
1. Usa fondo blanco o gris claro
2. Iluminación natural o suave
3. Múltiples ángulos del producto
4. Modelo usando la prenda (lifestyle)
5. Detalles de calidad (costuras, etiquetas)

### Para redes sociales:
1. Publica contenido regularmente
2. Usa hashtags relevantes: #streetwear #colombia #fashion
3. Interactúa con tu comunidad
4. Comparte contenido generado por usuarios
5. Mantén el mismo estilo visual

### Para marketing:
1. Ofrece descuentos a primeros compradores
2. Crea un programa de referidos
3. Colabora con influencers locales
4. Organiza sorteos y concursos
5. Cuenta la historia de tu marca

---

<div align="center">

**NEXVIBE**

*La nueva vibra del streetwear*

Ropa sin ruido. Solo estilo.

Made with 🔥 in Colombia 🇨🇴

[Instagram](https://instagram.com/nexvibe.co) • [TikTok](https://tiktok.com/@nexvibe.co) • [WhatsApp](https://wa.me/1234567)

</div>

