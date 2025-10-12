# 🚀 Configuración del Sistema - NEXVIBE

## 📦 Sistema Actual

Este proyecto es un **sitio web estático** que NO requiere backend:
- ✅ **Frontend estático** - HTML, CSS, JavaScript puro
- ✅ **Productos desde config.json** - Gestión simple sin base de datos
- ✅ **Checkout por WhatsApp** - Sin pasarelas de pago
- ✅ **Sin costos de hosting backend** - Totalmente gratis

## ⚠️ NOTA IMPORTANTE

**Este archivo contiene documentación de un sistema con Firebase y Wompi que fue removido.**
Si en el futuro deseas implementar un sistema de pagos y backend, consulta esta guía. 
Por ahora, el proyecto funciona perfectamente sin ningún backend.

---

## 🔥 PASO 1: Configurar Firebase

### 1.1 Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"**
3. Nombre del proyecto: `nexvibe-tienda` (o el que prefieras)
4. Deshabilita Google Analytics (opcional)
5. Haz clic en **"Crear proyecto"**

### 1.2 Configurar Firestore Database

1. En el menú lateral, ve a **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Iniciar en modo de prueba"** (por ahora)
4. Selecciona ubicación: **`us-central1`** o la más cercana
5. Haz clic en **"Habilitar"**

### 1.3 Configurar Authentication

1. En el menú lateral, ve a **"Authentication"**
2. Haz clic en **"Comenzar"**
3. Selecciona **"Correo electrónico/Contraseña"**
4. Activa el método
5. Haz clic en **"Guardar"**

### 1.4 Crear Usuario Admin

1. En Authentication, ve a la pestaña **"Users"**
2. Haz clic en **"Agregar usuario"**
3. Email: `admin@nexvibe.co` (o tu email)
4. Contraseña: Crea una contraseña segura
5. Haz clic en **"Agregar usuario"**

### 1.5 Obtener Credenciales

1. Ve a **⚙️ Configuración del proyecto** (icono de engranaje arriba)
2. En "Tus apps", haz clic en **"</>  Web"**
3. Nombre de la app: `NEXVIBE Web`
4. Haz clic en **"Registrar app"**
5. Copia el objeto `firebaseConfig`
6. Pégalo en `firebase-config.js` (línea 5)

```javascript
const firebaseConfig = {  
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXX",
    authDomain: "nexvibe-tienda.firebaseapp.com",
    projectId: "nexvibe-tienda",
    storageBucket: "nexvibe-tienda.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:xxxxxxxxxxxxx"
};
```

### 1.6 Configurar Reglas de Seguridad

En Firestore Database, ve a la pestaña **"Reglas"** y pega esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Productos: Todos pueden leer, solo admins pueden escribir
    match /productos/{productoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Ventas: Solo admins pueden leer/escribir
    match /ventas/{ventaId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Haz clic en **"Publicar"**

---

## 💳 PASO 2: Configurar Wompi

### 2.1 Crear Cuenta en Wompi

1. Ve a [Wompi.co](https://wompi.co/)
2. Haz clic en **"Regístrate"**
3. Completa el formulario de registro
4. Verifica tu email
5. Completa tu perfil de comercio

### 2.2 Obtener Llaves de API

1. Inicia sesión en [Wompi Dashboard](https://comercios.wompi.co/)
2. Ve a **"Configuración"** > **"API Keys"**
3. Copia tu **Public Key** (test)
   - Formato: `pub_test_xxxxxxxxxxxxxxx`
4. Pégala en `wompi-integration.js` (línea 7)

```javascript
const WOMPI_CONFIG = {
    publicKey: 'pub_test_xxxxxxxxxxxxxxx', // ← Pega aquí
    currency: 'COP',
    redirectUrl: window.location.origin + '/confirmacion.html'
};
```

### 2.3 Activar Webhook (Opcional)

Para recibir notificaciones de pagos:

1. En Wompi Dashboard, ve a **"Webhooks"**
2. Agrega tu URL de webhook (cuando tengas backend)
3. Selecciona eventos: `transaction.updated`

---

## 📂 PASO 3: Actualizar tu HTML

### 3.1 Agregar Scripts de Firebase

En `index.html`, antes de cerrar el `</body>`, agrega:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>

<!-- Wompi Checkout Widget -->
<script src="https://checkout.wompi.co/widget.js"></script>

<!-- Tus scripts -->
<script src="firebase-config.js"></script>
<script src="wompi-integration.js"></script>
<script src="script.js"></script>
```

### 3.2 Modificar script.js

En `script.js`, reemplaza la función `loadProducts()` con esta versión que usa Firebase:

```javascript
async function loadProducts() {
    try {
        // Inicializar Firebase si no está inicializado
        if (!db) {
            initFirebase();
        }
        
        // Cargar desde Firebase en lugar de config.json
        productos = await getProductosFromFirebase();
        
        if (productos.length > 0) {
            renderProducts(productos);
            setTimeout(() => {
                initCart();
                initProductModal();
                initStockSystem();
            }, 100);
            
            // Escuchar cambios en tiempo real
            listenToProductChanges(productosActualizados => {
                productos = productosActualizados;
                renderProducts(productos);
                initStockSystem();
            });
        } else {
            showNoProductsMessage();
        }
    } catch (error) {
        console.error('Error cargando productos:', error);
        showErrorMessage();
    }
}
```

### 3.3 Actualizar el checkout

En `script.js`, reemplaza la función del botón checkout con:

```javascript
checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Calcular total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Enviar a pago
    enviarPedidoConPago(cart, total);
});
```

---

## 🧪 PASO 4: Migrar Productos a Firebase

### Opción 1: Desde el Panel Admin

1. Abre `admin.html` en tu navegador
2. Inicia sesión con tu usuario admin
3. Ve a la pestaña **"Configuración"**
4. Haz clic en **"Migrar Productos desde config.json"**
5. Espera a que termine
6. ¡Listo! Los productos están en Firebase

### Opción 2: Manual desde la consola

1. Abre la consola del navegador (F12)
2. Ejecuta:
```javascript
initFirebase();
migrarProductosAFirebase();
```

---

## 🧪 PASO 5: Probar el Sistema

### 5.1 Probar carga de productos

1. Abre `index.html`
2. Verifica que los productos se carguen
3. Abre la consola → Debe decir "Firebase inicializado correctamente ✅"

### 5.2 Probar el panel admin

1. Abre `admin.html`
2. Inicia sesión con tu usuario
3. Verifica que veas los productos
4. Cambia el stock de un producto
5. Recarga `index.html` → El stock debería actualizarse

### 5.3 Probar pagos (modo test)

1. Agrega productos al carrito
2. Haz clic en "Finalizar compra"
3. Completa el formulario
4. En el checkout de Wompi, usa esta tarjeta de prueba:
   - **Número:** `4242 4242 4242 4242`
   - **Fecha:** Cualquier fecha futura
   - **CVV:** `123`
5. La compra debería procesarse
6. El stock debería actualizarse automáticamente

---

## 🔒 PASO 6: Seguridad (Producción)

### 6.1 Actualizar reglas de Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /productos/{productoId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
                                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /ventas/{ventaId} {
      allow read, write: if request.auth != null && 
                          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 6.2 Cambiar a Wompi Producción

1. En Wompi Dashboard, completa la verificación de tu negocio
2. Obtén tu **Public Key de producción**
3. Reemplaza en `wompi-integration.js`:
```javascript
publicKey: 'pub_prod_xxxxxxxxxxxxxxx', // Producción
```

---

## 📊 PASO 7: Monitoreo

### Ver ventas en Firebase Console

1. Ve a Firestore Database
2. Colección `ventas`
3. Verás todas las transacciones

### Ver ventas en Panel Admin

1. Abre `admin.html`
2. Pestaña **"Ventas"**
3. Verás listado de ventas con estados

---

## ⚠️ Problemas Comunes

### Error: "Firebase is not defined"
**Solución:** Verifica que los scripts de Firebase estén cargando antes de tus scripts

### Error: "Permission denied"
**Solución:** Verifica las reglas de Firestore y que el usuario esté autenticado

### Los productos no se cargan
**Solución:** 
1. Verifica que `firebaseConfig` esté correcto
2. Ejecuta la migración de productos
3. Revisa la consola del navegador

### El pago no se procesa
**Solución:**
1. Verifica la llave pública de Wompi
2. Usa la tarjeta de prueba correcta
3. Revisa la consola de Wompi Dashboard

---

## 🚀 Siguientes Pasos

### Opcional pero recomendado:

1. **Crear página de confirmación** (`confirmacion.html`)
2. **Implementar envío de emails** con Firebase Functions
3. **Agregar notificaciones** cuando se agote el stock
4. **Sistema de cupones** de descuento
5. **Analytics** para trackear ventas

---

## 📞 Soporte

### Documentación Oficial:
- [Firebase Docs](https://firebase.google.com/docs)
- [Wompi Docs](https://docs.wompi.co/)

### Si tienes problemas:
1. Revisa la consola del navegador
2. Verifica que todas las credenciales estén correctas
3. Asegúrate de que Firebase esté inicializado

---

## 💡 Costos

### Firebase (Plan Spark - Gratis)
- ✅ 50K lecturas/día
- ✅ 20K escrituras/día
- ✅ 1GB almacenamiento
- ✅ 10GB transferencia/mes

**Suficiente para ~500-1000 ventas/mes**

### Wompi
- 💳 2.99% + $900 por transacción
- ✅ Sin costos fijos mensuales
- ✅ Solo pagas cuando vendes

**Ejemplo:**
- Venta de $85.000 COP
- Comisión: $3.443 (~4%)
- Recibes: $81.557

---

## ✅ Checklist Final

Antes de lanzar a producción:

- [ ] Firebase configurado y probado
- [ ] Productos migrados a Firebase
- [ ] Usuario admin creado
- [ ] Wompi en modo producción
- [ ] Reglas de seguridad actualizadas
- [ ] Página de confirmación creada
- [ ] Probado el flujo completo de compra
- [ ] Configurado webhook de Wompi
- [ ] Dominio personalizado configurado
- [ ] SSL/HTTPS habilitado

---

**🎉 ¡Listo! Tu tienda está funcionando con pagos reales y stock automático.**

¿Necesitas ayuda con algún paso? Revisa la consola del navegador para ver mensajes de error detallados.

