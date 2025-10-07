# 🎨 Guía de Personalización NEXVIBE

Esta guía te ayudará a personalizar tu sitio web paso a paso.

---

## 📋 Checklist Rápido

Antes de publicar tu sitio, asegúrate de completar:

- [ ] Actualizar número de WhatsApp
- [ ] Actualizar email de contacto
- [ ] Actualizar enlaces de redes sociales
- [ ] Agregar imágenes reales de productos
- [ ] Agregar fotos hero/banner
- [ ] Agregar logo de la marca
- [ ] Personalizar texto "Sobre nosotros"
- [ ] Actualizar precios de productos
- [ ] Agregar favicon
- [ ] Probar en móvil

---

## 1️⃣ Cambiar Información de Contacto

### WhatsApp

**Ubicaciones en `index.html`:**

```html
<!-- Línea ~51 - Header -->
<a href="https://wa.me/573214710122" target="_blank" class="icon-link social-link">

<!-- Línea ~385 - Footer -->
<a href="https://wa.me/573214710122" target="_blank">

<!-- Línea ~402 - Botón flotante -->
<a href="https://wa.me/573214710122?text=Hola!%20Quiero%20hacer%20un%20pedido"
```

**Cómo obtener tu número:**
- Formato: Código de país + número sin espacios ni guiones
- Ejemplo Colombia: `573001234567`
- Ejemplo México: `525512345678`
- Ejemplo España: `34612345678`

### Email

```html
<!-- Busca en el archivo -->
hola@nexvibe.co

<!-- Reemplaza con tu email -->
```

### Redes Sociales

```html
<!-- Instagram -->
https://instagram.com  →  https://instagram.com/tu_usuario

<!-- TikTok -->
https://tiktok.com  →  https://tiktok.com/@tu_usuario

<!-- Facebook -->
https://facebook.com  →  https://facebook.com/tu_pagina
```

---

## 2️⃣ Personalizar Productos

### Agregar un nuevo producto:

```html
<div class="producto-card">
    <div class="producto-image">
        <!-- Badge opcional -->
        <div class="producto-badge">Nuevo</div>
        <!-- O usa "hot" para destacar -->
        <div class="producto-badge hot">Hot</div>
        
        <!-- Imagen del producto -->
        <img src="images/productos/mi-producto.jpg" alt="Nombre del Producto">
        
        <div class="producto-overlay">
            <button class="btn-add-cart" 
                    data-product="Nombre del Producto" 
                    data-price="85000">
                <i class="fas fa-shopping-bag"></i> Agregar
            </button>
        </div>
    </div>
    <div class="producto-info">
        <h3 class="producto-nombre">Nombre del Producto</h3>
        <p class="producto-descripcion">Descripción breve del producto</p>
        <p class="producto-precio">$85,000 COP</p>
    </div>
</div>
```

### Cambiar precios:

1. En `data-price="85000"` - Sin puntos ni comas
2. En el precio visible `$85,000 COP` - Formateado para lectura

---

## 3️⃣ Agregar Imágenes

### Hero / Banner Principal

```html
<!-- Busca esta línea en index.html -->
<div class="hero-image"></div>

<!-- Reemplaza con: -->
<div class="hero-image" style="background-image: url('images/hero/banner-principal.jpg');"></div>
```

**O mejor aún, en styles.css:**

```css
.hero-image {
    background-image: url('images/hero/banner-principal.jpg');
    background-size: cover;
    background-position: center;
}
```

### Productos

Reemplaza los placeholders:

```html
<!-- Antes -->
<div class="producto-placeholder">
    <i class="fas fa-tshirt"></i>
</div>

<!-- Después -->
<img src="images/productos/camiseta-negra.jpg" 
     alt="Camiseta Negra Oversize"
     loading="lazy">
```

### Galería Instagram

```html
<!-- Antes -->
<div class="galeria-placeholder">
    <i class="fab fa-instagram"></i>
</div>

<!-- Después -->
<img src="images/galeria/foto-1.jpg" 
     alt="Cliente usando NEXVIBE"
     loading="lazy">
```

---

## 4️⃣ Personalizar Textos

### Slogan / Tagline

```html
<!-- Hero section - Línea ~62 -->
<h1 class="hero-title">
    <span class="hero-title-line">Tu texto</span>
    <span class="hero-title-line">personalizado<span class="accent-dot">.</span></span>
</h1>
```

### Sobre Nosotros

```html
<!-- Sección ~182 -->
<p class="sobre-description">
    Tu historia de marca personalizada...
</p>
```

---

## 5️⃣ Cambiar Colores

### Colores principales en `styles.css`:

```css
:root {
    /* Cambia estos valores */
    --color-electric-blue: #00AEEF;  /* Tu color principal */
    --color-lime-green: #C6FF00;     /* Tu color secundario */
}
```

### Colores sugeridos según tu marca:

**Estilo urbano/moderno:**
- `#FF6B35` (Naranja vibrante)
- `#004E89` (Azul profundo)

**Estilo minimalista:**
- `#2D3142` (Gris oscuro)
- `#BFC0C0` (Gris claro)

**Estilo juvenil:**
- `#FF006E` (Rosa neón)
- `#8338EC` (Púrpura)

---

## 6️⃣ Agregar Logo

### 1. Prepara tu logo:
- Formato: SVG (recomendado) o PNG transparente
- Tamaño: 200x60px aproximadamente
- Guardar en: `images/logo/logo.svg`

### 2. Actualiza el HTML:

```html
<!-- Busca la clase .logo -->
<div class="logo">
    <a href="#home">
        <img src="images/logo/logo.svg" alt="NEXVIBE">
    </a>
</div>
```

### 3. Ajusta el CSS si es necesario:

```css
.logo img {
    height: 40px;
    width: auto;
}
```

---

## 7️⃣ Agregar Favicon

### 1. Crea tu favicon:
- Usa [Favicon.io](https://favicon.io/) para generar
- O diseña uno en 512x512px y conviértelo

### 2. Agrega en el `<head>` de index.html:

```html
<link rel="icon" type="image/png" sizes="32x32" href="images/logo/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="images/logo/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="images/logo/apple-touch-icon.png">
```

---

## 8️⃣ Optimización para SEO

### Meta Tags

Agrega en el `<head>`:

```html
<!-- Open Graph para redes sociales -->
<meta property="og:title" content="NEXVIBE - La nueva vibra del streetwear">
<meta property="og:description" content="Ropa oversize, básica y con actitud, hecha en Colombia">
<meta property="og:image" content="https://tu-sitio.com/images/og-image.jpg">
<meta property="og:url" content="https://tu-sitio.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="NEXVIBE">
<meta name="twitter:description" content="La nueva vibra del streetwear">
<meta name="twitter:image" content="https://tu-sitio.com/images/og-image.jpg">
```

---

## 9️⃣ Testing

### Checklist de pruebas:

#### Móvil:
- [ ] Menú hamburguesa funciona
- [ ] Carrito se abre correctamente
- [ ] Botones son fáciles de tocar
- [ ] Textos legibles
- [ ] Imágenes se cargan bien

#### Desktop:
- [ ] Menú de navegación funciona
- [ ] Hover effects funcionan
- [ ] Scroll suave funciona
- [ ] Carrito funciona
- [ ] Formulario funciona

#### Funcionalidad:
- [ ] Agregar productos al carrito
- [ ] Eliminar productos del carrito
- [ ] Contador de carrito actualiza
- [ ] WhatsApp se abre con mensaje correcto
- [ ] Formulario envía a WhatsApp
- [ ] Enlaces de redes sociales funcionan

---

## 🔟 Publicación

### Opción 1: GitHub Pages (Gratis)

```bash
# 1. Crea un repositorio en GitHub
# 2. Sube los archivos
git init
git add .
git commit -m "Sitio NEXVIBE inicial"
git branch -M main
git remote add origin https://github.com/tu-usuario/nexvibe.git
git push -u origin main

# 3. Activa GitHub Pages en Settings > Pages
```

### Opción 2: Netlify (Gratis)

1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta del proyecto
3. Obtén tu URL: `nexvibe.netlify.app`

### Opción 3: Hosting tradicional

1. Compra un hosting (Hostinger, GoDaddy, etc.)
2. Compra un dominio (nexvibe.com)
3. Sube archivos por FTP
4. Configura DNS

---

## 💡 Consejos Finales

### Para mejores resultados:

1. **Fotografía profesional**: Invierte en buenas fotos de producto
2. **Consistencia visual**: Mantén el mismo estilo en todas las fotos
3. **Descripciones claras**: Explica materiales, tallas, cuidados
4. **Precios transparentes**: Incluye costos de envío
5. **Responde rápido**: Contesta mensajes de WhatsApp pronto
6. **Actualiza regularmente**: Agrega nuevos productos frecuentemente

### Herramientas útiles:

- **Edición de fotos**: Photoshop, Canva, Photopea
- **Compresión de imágenes**: TinyPNG, Squoosh
- **Inspiración**: Dribbble, Behance, Pinterest
- **Paletas de colores**: Coolors.co, Adobe Color

---

## 🆘 Ayuda

Si tienes problemas o dudas:

1. Revisa el `README.md` principal
2. Busca en Google tu error específico
3. Contacta al desarrollador
4. Contrata a un freelancer en Fiverr o Workana

---

**¡Éxito con tu marca NEXVIBE! 🔥**

*La nueva vibra del streetwear*

