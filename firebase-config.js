/* ===================================
   NEXVIBE - Configuración de Firebase
   =================================== */

// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "tu-app-id",
    databaseURL: "https://tu-proyecto.firebaseio.com"
};

// Inicializar Firebase
let db;
let auth;

function initFirebase() {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();
        console.log('Firebase inicializado correctamente ✅');
        return true;
    } else {
        console.error('Firebase SDK no cargado. Verifica que los scripts estén incluidos.');
        return false;
    }
}

// ===================================
// Funciones de Base de Datos
// ===================================

// Obtener todos los productos
async function getProductosFromFirebase() {
    try {
        const snapshot = await db.collection('productos').where('activo', '==', true).get();
        const productos = [];
        
        snapshot.forEach(doc => {
            productos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return productos;
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        return [];
    }
}

// Actualizar stock de un producto
async function updateStockFirebase(productoId, cantidad) {
    try {
        const productoRef = db.collection('productos').doc(productoId);
        const doc = await productoRef.get();
        
        if (doc.exists) {
            const stockActual = doc.data().stock;
            const nuevoStock = Math.max(0, stockActual - cantidad);
            
            await productoRef.update({
                stock: nuevoStock,
                ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log(`Stock actualizado: ${productoId} → ${nuevoStock}`);
            return nuevoStock;
        } else {
            console.error('Producto no encontrado');
            return null;
        }
    } catch (error) {
        console.error('Error actualizando stock:', error);
        return null;
    }
}

// Registrar una venta
async function registrarVentaFirebase(venta) {
    try {
        const ventaRef = await db.collection('ventas').add({
            ...venta,
            fecha: firebase.firestore.FieldValue.serverTimestamp(),
            estado: 'pendiente'
        });
        
        console.log('Venta registrada:', ventaRef.id);
        return ventaRef.id;
    } catch (error) {
        console.error('Error registrando venta:', error);
        return null;
    }
}

// Escuchar cambios en productos en tiempo real
function listenToProductChanges(callback) {
    return db.collection('productos')
        .where('activo', '==', true)
        .onSnapshot(snapshot => {
            const productos = [];
            snapshot.forEach(doc => {
                productos.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(productos);
        }, error => {
            console.error('Error en listener:', error);
        });
}

// ===================================
// Migrar productos de config.json a Firebase
// ===================================
async function migrarProductosAFirebase() {
    try {
        const response = await fetch('config.json');
        const config = await response.json();
        const productos = config.productos || [];
        
        console.log(`Migrando ${productos.length} productos a Firebase...`);
        
        for (const producto of productos) {
            await db.collection('productos').doc(producto.id).set({
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio,
                stock: producto.stock,
                imagen: producto.imagen,
                badge: producto.badge,
                categoria: producto.categoria,
                tallas: producto.tallas,
                colores: producto.colores,
                activo: producto.activo,
                fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
                ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        console.log('✅ Migración completada');
        return true;
    } catch (error) {
        console.error('Error en migración:', error);
        return false;
    }
}

// ===================================
// Funciones de Autenticación (Admin)
// ===================================

async function loginAdmin(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('Admin autenticado:', userCredential.user.email);
        return userCredential.user;
    } catch (error) {
        console.error('Error de autenticación:', error);
        return null;
    }
}

function logoutAdmin() {
    return auth.signOut();
}

function onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
}

// Verificar si el usuario es admin
function isAdmin(user) {
    // Por ahora, cualquier usuario autenticado es admin
    // En producción, deberías usar Firebase Custom Claims
    return user !== null;
}

