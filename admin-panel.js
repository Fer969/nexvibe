/* ===================================
   NEXVIBE - Panel Administrativo JS
   =================================== */

let currentUser = null;
let productosListener = null;

// ===================================
// Inicialización
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    if (initFirebase()) {
        setupAuth();
        setupEventListeners();
    } else {
        alert('Error inicializando Firebase. Verifica la configuración.');
    }
});

// ===================================
// Autenticación
// ===================================

function setupAuth() {
    onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            showAdminPanel();
            loadDashboardData();
        } else {
            currentUser = null;
            showLoginScreen();
        }
    });
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('adminName').textContent = currentUser.email;
}

// ===================================
// Event Listeners
// ===================================

function setupEventListeners() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        
        const user = await loginAdmin(email, password);
        if (!user) {
            alert('Credenciales incorrectas');
        }
    });
    
    // Logout
    document.getElementById('btnLogout').addEventListener('click', async function() {
        await logoutAdmin();
        if (productosListener) {
            productosListener(); // Desuscribirse
        }
    });
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Migrar productos
    document.getElementById('btnMigrar').addEventListener('click', async function() {
        if (confirm('¿Estás seguro de migrar los productos desde config.json?')) {
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Migrando...';
            
            const success = await migrarProductosAFirebase();
            
            if (success) {
                alert('✅ Productos migrados correctamente');
                loadProductos();
            } else {
                alert('❌ Error en la migración');
            }
            
            this.disabled = false;
            this.innerHTML = '<i class="fas fa-upload"></i> Migrar Productos desde config.json';
        }
    });
}

// ===================================
// Tabs
// ===================================

function switchTab(tabName) {
    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Actualizar contenido
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // Cargar datos según la tab
    if (tabName === 'ventas') {
        loadVentas();
    }
}

// ===================================
// Cargar Dashboard
// ===================================

async function loadDashboardData() {
    loadStats();
    loadProductos();
}

async function loadStats() {
    try {
        const productosSnapshot = await db.collection('productos').get();
        const productos = productosSnapshot.docs.map(doc => doc.data());
        
        const total = productos.length;
        const enStock = productos.filter(p => p.stock > 0).length;
        const agotados = productos.filter(p => p.stock === 0).length;
        
        document.getElementById('statProductos').textContent = total;
        document.getElementById('statEnStock').textContent = enStock;
        document.getElementById('statAgotados').textContent = agotados;
        
        // Ventas de hoy
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        const ventasSnapshot = await db.collection('ventas')
            .where('fecha', '>=', hoy)
            .get();
        
        document.getElementById('statVentas').textContent = ventasSnapshot.size;
        
    } catch (error) {
        console.error('Error cargando stats:', error);
    }
}

// ===================================
// Cargar Productos
// ===================================

function loadProductos() {
    const tbody = document.getElementById('productosTableBody');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin"></i></td></tr>';
    
    // Listener en tiempo real
    productosListener = listenToProductChanges(productos => {
        renderProductosTable(productos);
        loadStats(); // Actualizar stats
    });
}

function renderProductosTable(productos) {
    const tbody = document.getElementById('productosTableBody');
    
    if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #999;">No hay productos. Usa el botón "Agregar Producto" o "Migrar".</td></tr>';
        return;
    }
    
    tbody.innerHTML = productos.map(producto => `
        <tr>
            <td>
                <img src="${producto.imagen}" alt="${producto.nombre}" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
            </td>
            <td>
                <strong>${producto.nombre}</strong>
                <br>
                <small style="color: #999;">${producto.categoria}</small>
            </td>
            <td>
                <strong>$${producto.precio.toLocaleString()} COP</strong>
            </td>
            <td>
                <input type="number" 
                       class="stock-input" 
                       value="${producto.stock}" 
                       min="0"
                       data-producto-id="${producto.id}">
            </td>
            <td>
                ${getStockBadge(producto.stock)}
            </td>
            <td>
                <button class="btn-update-stock" onclick="actualizarStock('${producto.id}')">
                    <i class="fas fa-save"></i> Guardar
                </button>
            </td>
        </tr>
    `).join('');
}

function getStockBadge(stock) {
    if (stock === 0) {
        return '<span class="estado-badge rechazado">Agotado</span>';
    } else if (stock <= 10) {
        return '<span class="estado-badge pendiente">Bajo Stock</span>';
    } else {
        return '<span class="estado-badge aprobado">Disponible</span>';
    }
}

// ===================================
// Actualizar Stock
// ===================================

async function actualizarStock(productoId) {
    try {
        const input = document.querySelector(`input[data-producto-id="${productoId}"]`);
        const nuevoStock = parseInt(input.value);
        
        if (isNaN(nuevoStock) || nuevoStock < 0) {
            alert('Stock inválido');
            return;
        }
        
        await db.collection('productos').doc(productoId).update({
            stock: nuevoStock,
            ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Mostrar confirmación
        const btn = event.target.closest('button');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Guardado';
        btn.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.backgroundColor = '';
        }, 2000);
        
    } catch (error) {
        console.error('Error actualizando stock:', error);
        alert('Error actualizando el stock');
    }
}

// ===================================
// Cargar Ventas
// ===================================

async function loadVentas() {
    try {
        const ventasList = document.getElementById('ventasList');
        ventasList.innerHTML = '<p style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin"></i></p>';
        
        const snapshot = await db.collection('ventas')
            .orderBy('fecha', 'desc')
            .limit(20)
            .get();
        
        if (snapshot.empty) {
            ventasList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No hay ventas registradas</p>';
            return;
        }
        
        ventasList.innerHTML = snapshot.docs.map(doc => {
            const venta = doc.data();
            const fecha = venta.fecha ? venta.fecha.toDate().toLocaleString('es-CO') : 'Fecha no disponible';
            
            return `
                <div class="venta-item">
                    <div>
                        <strong>${venta.referencia || doc.id}</strong>
                        <br>
                        <small style="color: #999;">${fecha}</small>
                        <br>
                        <small>${venta.items ? venta.items.length : 0} productos</small>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">
                            $${venta.total ? venta.total.toLocaleString() : '0'} COP
                        </div>
                        <span class="estado-badge ${venta.estado}">${venta.estado || 'pendiente'}</span>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error cargando ventas:', error);
        document.getElementById('ventasList').innerHTML = 
            '<p style="text-align: center; color: #F44336; padding: 2rem;">Error cargando ventas</p>';
    }
}

