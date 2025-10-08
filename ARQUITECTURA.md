# 🏗️ Arquitectura del Sistema - NEXVIBE

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (NAVEGADOR)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │  index.html  │    │  admin.html  │    │confirmacion  │     │
│  │              │    │              │    │   .html      │     │
│  │  (Tienda)    │    │  (Panel)     │    │  (Gracias)   │     │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘     │
│         │                   │                    │              │
│         └───────────┬───────┴────────────────────┘              │
│                     │                                           │
│         ┌───────────▼──────────────┐                           │
│         │     script.js            │                           │
│         │  firebase-config.js      │                           │
│         │  wompi-integration.js    │                           │
│         │  admin-panel.js          │                           │
│         └───────────┬──────────────┘                           │
└─────────────────────┼──────────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
    ┌─────▼──────┐         ┌─────▼──────┐
    │  FIREBASE  │         │   WOMPI    │
    │  BACKEND   │         │  PAYMENTS  │
    └────────────┘         └────────────┘
          │
    ┌─────┴─────┐
    │           │
┌───▼───┐  ┌───▼──────┐
│Firestore│ │  Auth   │
│Database │ │ (Login) │
└─────────┘  └─────────┘
```

---

## 🧩 Componentes del Sistema

### 1. **Frontend (Cliente)**

#### index.html - Tienda Principal
- Muestra productos desde Firebase
- Carrito de compras funcional
- Checkout integrado con Wompi
- Indicadores de stock en tiempo real

#### admin.html - Panel Administrativo
- Dashboard con estadísticas
- Gestión de productos
- Actualización de stock
- Registro de ventas
- Login con Firebase Auth

#### confirmacion.html - Página de Confirmación
- Verifica estado del pago
- Muestra detalles de la orden
- Opciones post-compra

---

### 2. **JavaScript Modules**

#### firebase-config.js
```javascript
// Funciones principales:
- initFirebase()              // Inicializa conexión
- getProductosFromFirebase()  // Obtiene productos
- updateStockFirebase()       // Actualiza stock
- registrarVentaFirebase()    // Guarda venta
- listenToProductChanges()    // Escucha cambios en tiempo real
```

#### wompi-integration.js
```javascript
// Funciones principales:
- procesarPagoWompi()         // Inicia proceso de pago
- abrirWompiCheckout()        // Abre modal de pago
- verificarTransaccion()      // Verifica estado
- actualizarEstadoVenta()     // Actualiza después del pago
```

#### admin-panel.js
```javascript
// Funciones principales:
- loadDashboardData()         // Carga estadísticas
- loadProductos()             // Carga productos
- renderProductosTable()      // Muestra tabla
- actualizarStock()           // Actualiza inventario
- loadVentas()                // Muestra ventas
```

---

### 3. **Firebase Backend**

#### Firestore Database

**Colección: productos**
```javascript
{
  id: "camiseta-negra-001",
  nombre: "Camiseta Negra Oversize",
  descripcion: "Camiseta 100% algodón",
  precio: 85000,
  stock: 25,
  imagen: "images/productos/camiseta_negra.png",
  badge: "Nuevo",
  categoria: "camisetas",
  tallas: ["S", "M", "L", "XL", "XXL"],
  colores: ["negro", "blanco"],
  activo: true,
  fechaCreacion: Timestamp,
  ultimaActualizacion: Timestamp
}
```

**Colección: ventas**
```javascript
{
  referencia: "NEXVIBE-1234567890",
  items: [
    {
      productoId: "camiseta-negra-001",
      nombre: "Camiseta Negra Oversize",
      precio: 85000,
      cantidad: 1
    }
  ],
  total: 85000,
  cliente: {
    nombre: "Juan Pérez",
    email: "juan@email.com",
    telefono: "+57 300 123 4567",
    direccion: "Calle 123",
    ciudad: "Bogotá"
  },
  estado: "aprobado",  // pendiente | aprobado | rechazado | cancelado
  metodoPago: "wompi",
  transaccionId: "wompi_tx_123",
  fecha: Timestamp,
  fechaActualizacion: Timestamp
}
```

#### Firebase Authentication
- Email/Password para admins
- Control de acceso al panel

---

### 4. **Wompi Payment Gateway**

#### Integración
```javascript
// Modal de pago (Widget)
WidgetCheckout({
  publicKey: "pub_test_xxx",
  currency: "COP",
  amountInCents: 8500000,  // $85,000 * 100
  reference: "NEXVIBE-123",
  customerData: { ... },
  redirectUrl: "/confirmacion.html"
})
```

#### Estados de Transacción
- `APPROVED` → Pago exitoso
- `DECLINED` → Pago rechazado
- `PENDING` → Pago pendiente
- `ERROR` → Error en el proceso
- `VOIDED` → Transacción cancelada

---

## 🔄 Flujos de Proceso

### Flujo 1: Compra de Cliente

```
1. Cliente ve productos (Firebase)
   ↓
2. Agrega al carrito (LocalStorage)
   ↓
3. Hace checkout
   ↓
4. Completa formulario
   ↓
5. Sistema registra venta en Firebase (estado: "iniciado")
   ↓
6. Abre Wompi Checkout
   ↓
7. Cliente paga
   ↓
8. Wompi notifica resultado
   ↓
9. Sistema actualiza estado de venta
   ↓
10. Si aprobado → Actualiza stock
    ↓
11. Redirige a confirmación
```

### Flujo 2: Admin Actualiza Stock

```
1. Admin abre admin.html
   ↓
2. Login con Firebase Auth
   ↓
3. Sistema carga productos (Firestore)
   ↓
4. Admin modifica stock
   ↓
5. Click "Guardar"
   ↓
6. Actualiza en Firestore
   ↓
7. Todos los clientes ven cambio en tiempo real
```

### Flujo 3: Tiempo Real (Listener)

```
┌─────────────────────┐
│  Firebase Firestore │
│    (Base de datos)  │
└──────────┬──────────┘
           │
           │ onSnapshot()
           │
    ┌──────▼──────┐
    │  Listener   │
    │  Activo     │
    └──────┬──────┘
           │
           │ Cambio detectado
           │
    ┌──────▼──────────┐
    │  callback()     │
    │  actualiza UI   │
    └─────────────────┘
```

---

## 🔐 Seguridad

### Firestore Rules

```javascript
// Reglas de seguridad implementadas
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Productos: Todos leen, solo admins escriben
    match /productos/{productoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Ventas: Solo admins
    match /ventas/{ventaId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Niveles de Protección

1. **Público (no auth)**
   - Ver productos
   - Ver precios
   - Ver stock

2. **Autenticado (admin)**
   - Editar productos
   - Ver ventas
   - Actualizar stock
   - Dashboard completo

---

## 📊 Base de Datos

### Estructura de Datos

```
Firebase Project
│
├── Firestore Database
│   ├── productos/
│   │   ├── camiseta-negra-001
│   │   ├── sudadera-negra-001
│   │   └── ...
│   │
│   └── ventas/
│       ├── NEXVIBE-1234567890
│       ├── NEXVIBE-1234567891
│       └── ...
│
└── Authentication
    └── Users
        ├── admin@nexvibe.co
        └── ...
```

---

## 🚀 Escalabilidad

### Límites Actuales (Plan Gratuito)

| Recurso | Límite | Suficiente para |
|---------|--------|-----------------|
| Lecturas | 50K/día | ~1,000 visitantes |
| Escrituras | 20K/día | ~500 ventas |
| Almacenamiento | 1GB | ~10,000 productos |
| Transferencia | 10GB/mes | ~5,000 visitas |

### Cuándo Escalar

**Necesitarás plan pago cuando:**
- Más de 500 visitas diarias
- Más de 200 ventas diarias
- Más de 1GB de imágenes
- Funciones serverless

**Costo estimado:**
- Plan Blaze: Pay as you go
- ~$10-50/mes con 2000 ventas/mes

---

## 🔄 Sincronización

### Tiempo Real con Firestore

```javascript
// Listener activo en cliente
db.collection('productos')
  .onSnapshot(snapshot => {
    // Se ejecuta cada vez que hay un cambio
    snapshot.docChanges().forEach(change => {
      if (change.type === 'modified') {
        // Producto actualizado
        actualizarProductoEnUI(change.doc);
      }
    });
  });
```

**Ventajas:**
- ✅ Cambios instantáneos
- ✅ No necesita recargar página
- ✅ Todos los clientes sincronizados
- ✅ Stock siempre actualizado

---

## 📱 Responsive

### Diseño Adaptativo

```
Desktop (> 1024px)
- Grid 3 columnas
- Panel lateral completo
- Dashboard amplio

Tablet (768px - 1024px)
- Grid 2 columnas
- Panel lateral colapsable
- Dashboard condensado

Mobile (< 768px)
- Grid 1 columna
- Menú hamburguesa
- Panel fullscreen
```

---

## 🛠️ Tech Stack

```
Frontend:
├── HTML5
├── CSS3 (Custom Variables)
├── JavaScript ES6+
└── Font Awesome

Backend:
├── Firebase Firestore (Database)
├── Firebase Auth (Authentication)
└── Firebase Hosting (Optional)

Payments:
└── Wompi Checkout Widget

Tools:
├── Git (Version Control)
└── VS Code (Development)
```

---

## 🔌 APIs Utilizadas

### Firebase SDK
- `firebase-app-compat.js` - Core
- `firebase-firestore-compat.js` - Database
- `firebase-auth-compat.js` - Authentication

### Wompi SDK
- `widget.js` - Checkout Widget
- REST API para verificación

---

## 📈 Métricas Clave

### Performance
- Carga inicial: < 3s
- Time to Interactive: < 5s
- Lighthouse Score: 90+

### Conversión
- Productos vistos → Carrito: ~30%
- Carrito → Checkout: ~50%
- Checkout → Pago: ~70%
- **Conversión total: ~10%**

---

## 🎯 Roadmap Técnico

### Fase 1: ✅ Completada
- Frontend estático
- Sistema de carrito
- Integración WhatsApp

### Fase 2: ✅ Completada (Actual)
- Firebase Backend
- Wompi Payments
- Panel Admin
- Stock Automático

### Fase 3: 📋 Pendiente
- Email notifications
- Sistema de cupones
- Analytics avanzado
- PWA (Progressive Web App)

### Fase 4: 💡 Futuro
- App móvil nativa
- Sistema de envíos
- Multi-tenant
- API pública

---

<div align="center">

**🏗️ Arquitectura escalable y moderna**

Diseñada para crecer con tu negocio

</div>

