/* ===================================
   NEXVIBE - Integración con Wompi
   Pasarela de pagos para Colombia
   =================================== */

// IMPORTANTE: Reemplaza con tus llaves de Wompi
const WOMPI_CONFIG = {
    publicKey: 'pub_test_TU_PUBLIC_KEY_AQUI', // Test: pub_test_xxx | Producción: pub_prod_xxx
    currency: 'COP',
    redirectUrl: window.location.origin + '/confirmacion.html'
};

// ===================================
// Procesar pago con Wompi
// ===================================

async function procesarPagoWompi(datosVenta) {
    try {
        const {
            items,
            total,
            cliente
        } = datosVenta;
        
        // Generar referencia única
        const referencia = `NEXVIBE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Preparar datos para Wompi
        const pagoData = {
            public_key: WOMPI_CONFIG.publicKey,
            currency: WOMPI_CONFIG.currency,
            amount_in_cents: total * 100, // Wompi usa centavos
            reference: referencia,
            redirect_url: WOMPI_CONFIG.redirectUrl,
            customer_data: {
                email: cliente.email,
                full_name: cliente.nombre,
                phone_number: cliente.telefono
            },
            shipping_address: {
                address_line_1: cliente.direccion || 'No especificado',
                country: 'CO',
                region: cliente.ciudad || 'No especificado',
                city: cliente.ciudad || 'No especificado',
                phone_number: cliente.telefono
            }
        };
        
        // Registrar venta en Firebase ANTES de procesar el pago
        const ventaId = await registrarVentaFirebase({
            referencia: referencia,
            items: items,
            total: total,
            cliente: cliente,
            estado: 'iniciado',
            metodoPago: 'wompi'
        });
        
        // Abrir Wompi Checkout
        abrirWompiCheckout(pagoData, ventaId);
        
        return {
            success: true,
            referencia: referencia,
            ventaId: ventaId
        };
        
    } catch (error) {
        console.error('Error procesando pago:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// ===================================
// Abrir modal de Wompi
// ===================================

function abrirWompiCheckout(pagoData, ventaId) {
    // Crear formulario para Wompi Checkout Widget
    const checkout = new WidgetCheckout({
        currency: pagoData.currency,
        amountInCents: pagoData.amount_in_cents,
        reference: pagoData.reference,
        publicKey: pagoData.public_key,
        redirectUrl: pagoData.redirect_url,
        customerData: pagoData.customer_data,
        shippingAddress: pagoData.shipping_address,
    });
    
    checkout.open(function(result) {
        const transaction = result.transaction;
        console.log('Transacción:', transaction);
        
        // Actualizar estado de la venta en Firebase
        actualizarEstadoVenta(ventaId, transaction);
    });
}

// ===================================
// Verificar estado de transacción
// ===================================

async function verificarTransaccion(transactionId) {
    try {
        // En producción, esto debería hacerse desde el backend
        // por seguridad. Aquí es solo demo.
        const response = await fetch(`https://production.wompi.co/v1/transactions/${transactionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${WOMPI_CONFIG.publicKey}`
            }
        });
        
        const data = await response.json();
        return data.data;
        
    } catch (error) {
        console.error('Error verificando transacción:', error);
        return null;
    }
}

// ===================================
// Actualizar estado de venta
// ===================================

async function actualizarEstadoVenta(ventaId, transaction) {
    try {
        const estado = mapearEstadoWompi(transaction.status);
        
        await db.collection('ventas').doc(ventaId).update({
            transaccionId: transaction.id,
            estado: estado,
            datosTransaccion: transaction,
            fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Si el pago fue aprobado, actualizar stock
        if (estado === 'aprobado') {
            const venta = await db.collection('ventas').doc(ventaId).get();
            const items = venta.data().items;
            
            for (const item of items) {
                await updateStockFirebase(item.productoId, item.cantidad);
            }
            
            console.log('✅ Pago aprobado y stock actualizado');
        }
        
        return true;
        
    } catch (error) {
        console.error('Error actualizando venta:', error);
        return false;
    }
}

// ===================================
// Mapear estados de Wompi
// ===================================

function mapearEstadoWompi(wompiStatus) {
    const estados = {
        'APPROVED': 'aprobado',
        'DECLINED': 'rechazado',
        'PENDING': 'pendiente',
        'ERROR': 'error',
        'VOIDED': 'cancelado'
    };
    
    return estados[wompiStatus] || 'desconocido';
}

// ===================================
// Alternativa: Link de pago de Wompi
// ===================================

async function crearLinkPagoWompi(datosVenta) {
    try {
        const {
            items,
            total,
            cliente
        } = datosVenta;
        
        const referencia = `NEXVIBE-${Date.now()}`;
        
        // Crear link de pago
        const response = await fetch('https://production.wompi.co/v1/payment_links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${WOMPI_CONFIG.publicKey}`
            },
            body: JSON.stringify({
                name: `Pedido NEXVIBE ${referencia}`,
                description: `Pedido de ${items.length} productos`,
                single_use: true,
                collect_shipping: true,
                currency: WOMPI_CONFIG.currency,
                amount_in_cents: total * 100,
                redirect_url: WOMPI_CONFIG.redirectUrl
            })
        });
        
        const data = await response.json();
        return data.data.url;
        
    } catch (error) {
        console.error('Error creando link de pago:', error);
        return null;
    }
}

// ===================================
// Integración con WhatsApp + Wompi
// ===================================

async function enviarPedidoConPago(carrito, total) {
    try {
        // Datos del cliente (puedes pedir esto en un form)
        const cliente = {
            nombre: prompt('¿Cuál es tu nombre completo?'),
            email: prompt('¿Cuál es tu email?'),
            telefono: prompt('¿Tu número de WhatsApp?'),
            direccion: prompt('¿Dirección de envío?'),
            ciudad: prompt('¿Ciudad?')
        };
        
        if (!cliente.nombre || !cliente.email || !cliente.telefono) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        // Preparar items con ID de producto
        const items = carrito.map(item => ({
            productoId: item.id || extractProductId(item.name),
            nombre: item.name,
            precio: item.price,
            cantidad: 1
        }));
        
        // Procesar pago
        const resultado = await procesarPagoWompi({
            items: items,
            total: total,
            cliente: cliente
        });
        
        if (resultado.success) {
            console.log('Pago iniciado correctamente');
            // El checkout de Wompi se abrirá automáticamente
        } else {
            alert('Error procesando el pago. Intenta de nuevo.');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error. Por favor intenta de nuevo.');
    }
}

// Función auxiliar para extraer ID del producto
function extractProductId(productName) {
    // Si el nombre del producto incluye el ID, extraerlo
    // Por ahora, generar uno basado en el nombre
    return productName.toLowerCase().replace(/\s+/g, '-').substring(0, 20);
}

