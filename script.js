/* ===================================
   NEXVIBE - JavaScript Principal
   La nueva vibra del streetwear
   =================================== */

// ===================================
// Estado global del carrito
// ===================================
let cart = [];

// ===================================
// Inicialización
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initCart();
    initContactForm();
    initScrollEffects();
    initAnimations();
    initProductModal();
    loadCartFromStorage();
});

// ===================================
// Navegación
// ===================================
function initNavigation() {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect en header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Toggle menú móvil
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Cerrar menú al hacer clic en enlaces
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remover active de todos los enlaces
            navLinks.forEach(l => l.classList.remove('active'));
            // Agregar active al enlace clickeado
            this.classList.add('active');
            
            // Cerrar menú móvil
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Actualizar enlace activo según sección visible
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===================================
// Sistema de Carrito
// ===================================
function initCart() {
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    
    // Abrir carrito
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        openCart();
    });
    
    // Cerrar carrito
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    // Agregar productos al carrito
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productName = this.getAttribute('data-product');
            const productPrice = parseInt(this.getAttribute('data-price'));
            
            addToCart(productName, productPrice);
            
            // Feedback visual
            this.innerHTML = '<i class="fas fa-check"></i> Agregado';
            this.style.backgroundColor = '#C6FF00';
            this.style.color = '#000';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-shopping-bag"></i> Agregar';
                this.style.backgroundColor = '';
                this.style.color = '';
            }, 2000);
        });
    });
    
    // Checkout button
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }
            
            // Crear mensaje de WhatsApp
            let message = '¡Hola! Quiero hacer un pedido:\n\n';
            let total = 0;
            
            cart.forEach((item, index) => {
                message += `${index + 1}. ${item.name} - $${item.price.toLocaleString()} COP\n`;
                total += item.price;
            });
            
            message += `\nTotal: $${total.toLocaleString()} COP`;
            
            const whatsappUrl = `https://wa.me/573214710122?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
}

function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    saveCartToStorage();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    saveCartToStorage();
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Actualizar contador
    cartCount.textContent = cart.length;
    
    // Actualizar items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas fa-tshirt"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString()} COP</div>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">
                        Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Actualizar total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = `$${total.toLocaleString()} COP`;
}

function saveCartToStorage() {
    localStorage.setItem('nexvibe_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('nexvibe_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// ===================================
// Formulario de Contacto
// ===================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const mensaje = document.getElementById('mensaje').value;
            
            // Crear mensaje de WhatsApp
            let whatsappMessage = `¡Hola! Me contacto desde la web:\n\n`;
            whatsappMessage += `Nombre: ${nombre}\n`;
            whatsappMessage += `Email: ${email}\n`;
            if (telefono) {
                whatsappMessage += `Teléfono: ${telefono}\n`;
            }
            whatsappMessage += `\nMensaje:\n${mensaje}`;
            
            const whatsappUrl = `https://wa.me/573214710122?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            
            // Limpiar formulario
            contactForm.reset();
            
            // Mostrar mensaje de confirmación
            alert('¡Gracias por contactarnos! Te redirigiremos a WhatsApp.');
        });
    }
}

// ===================================
// Efectos de Scroll
// ===================================
function initScrollEffects() {
    // Parallax en hero
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${parallax}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.7;
            }
        });
    }
    
    // Fade in en scroll para productos y galería
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar productos
    const productoCards = document.querySelectorAll('.producto-card');
    productoCards.forEach(card => {
        // No ocultar inicialmente, solo agregar transición
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Observar items de galería
    const galeriaItems = document.querySelectorAll('.galeria-item');
    galeriaItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// ===================================
// Animaciones
// ===================================
function initAnimations() {
    // Agregar clase fade-in cuando los elementos entran en viewport
    const fadeElements = document.querySelectorAll('.fade-in');
    
    fadeElements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    });
}

// ===================================
// Smooth Scroll para enlaces
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // No aplicar smooth scroll a botones del carrito
        if (href === '#' || this.classList.contains('cart-icon')) {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Prevenir zoom en iOS en inputs
// ===================================
if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const viewport = document.querySelector('meta[name=viewport]');
            viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
        });
        
        input.addEventListener('blur', function() {
            const viewport = document.querySelector('meta[name=viewport]');
            viewport.setAttribute('content', 'width=device-width, initial-scale=1');
        });
    });
}

// ===================================
// Easter Egg - Doble click en logo
// ===================================
const logo = document.querySelector('.logo a');
let clickCount = 0;
let clickTimer;

if (logo) {
    logo.addEventListener('click', function(e) {
        clickCount++;
        
        if (clickCount === 2) {
            // Easter egg activado
            document.body.style.animation = 'rainbow 2s ease';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
            clickCount = 0;
        }
        
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 500);
    });
}

// Animación rainbow para easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0%, 100% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===================================
// Optimización de performance
// ===================================

// Lazy loading deshabilitado temporalmente para evitar conflictos
// if ('loading' in HTMLImageElement.prototype) {
//     const images = document.querySelectorAll('img[loading="lazy"]');
//     images.forEach(img => {
//         img.src = img.dataset.src;
//     });
// } else {
//     // Fallback para navegadores antiguos
//     const script = document.createElement('script');
//     script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
//     document.body.appendChild(script);
// }

// ===================================
// Console message
// ===================================
// ===================================
// Product Modal
// ===================================
function initProductModal() {
    const productModal = document.getElementById('productModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const productoCards = document.querySelectorAll('.producto-card');
    
    // Variables del modal
    let currentProduct = null;
    let selectedSize = 'M';
    let selectedColor = 'negro';
    let quantity = 1;
    
    // Abrir modal al hacer clic en producto
    productoCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // No abrir modal si se hace clic en el botón de agregar
            if (e.target.closest('.btn-add-cart')) {
                return;
            }
            
            const productImage = this.querySelector('img');
            const productName = this.querySelector('.producto-nombre').textContent;
            const productDescription = this.querySelector('.producto-descripcion').textContent;
            const productPrice = this.querySelector('.producto-precio').textContent;
            const productBadge = this.querySelector('.producto-badge');
            const addToCartBtn = this.querySelector('.btn-add-cart');
            
            // Guardar datos del producto actual
            currentProduct = {
                name: productName,
                description: productDescription,
                price: addToCartBtn.getAttribute('data-price'),
                image: productImage.src,
                badge: productBadge ? productBadge.textContent : null
            };
            
            // Llenar modal
            fillModal();
            openModal();
        });
    });
    
    // Cerrar modal
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Funciones del modal
    function fillModal() {
        document.getElementById('modalProductImage').src = currentProduct.image;
        document.getElementById('modalProductImage').alt = currentProduct.name;
        document.getElementById('modalTitle').textContent = currentProduct.name;
        document.getElementById('modalDescription').textContent = currentProduct.description;
        document.getElementById('modalPrice').textContent = currentProduct.price ? `$${parseInt(currentProduct.price).toLocaleString()} COP` : 'Precio no disponible';
        
        // Badge
        const modalBadge = document.getElementById('modalBadge');
        if (currentProduct.badge) {
            modalBadge.textContent = currentProduct.badge;
            modalBadge.className = `modal-badge ${currentProduct.badge.toLowerCase()}`;
            modalBadge.style.display = 'block';
        } else {
            modalBadge.style.display = 'none';
        }
    }
    
    function openModal() {
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Resetear selecciones
        selectedSize = 'M';
        selectedColor = 'negro';
        quantity = 1;
        updateSelections();
    }
    
    function closeModal() {
        productModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Selección de tallas
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectedSize = this.getAttribute('data-size');
            updateSelections();
        });
    });
    
    // Selección de colores
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectedColor = this.getAttribute('data-color');
            updateSelections();
        });
    });
    
    // Selector de cantidad
    document.getElementById('qtyMinus').addEventListener('click', function() {
        if (quantity > 1) {
            quantity--;
            updateSelections();
        }
    });
    
    document.getElementById('qtyPlus').addEventListener('click', function() {
        if (quantity < 10) {
            quantity++;
            updateSelections();
        }
    });
    
    function updateSelections() {
        // Actualizar tallas
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-size') === selectedSize) {
                btn.classList.add('active');
            }
        });
        
        // Actualizar colores
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-color') === selectedColor) {
                btn.classList.add('active');
            }
        });
        
        // Actualizar cantidad
        document.getElementById('qtyNumber').textContent = quantity;
    }
    
    // Agregar al carrito desde modal
    document.getElementById('modalAddToCart').addEventListener('click', function() {
        if (currentProduct && currentProduct.price) {
            const totalPrice = parseInt(currentProduct.price) * quantity;
            const productName = `${currentProduct.name} - Talla: ${selectedSize}, Color: ${selectedColor}`;
            
            // Agregar múltiples veces según la cantidad
            for (let i = 0; i < quantity; i++) {
                addToCart(productName, parseInt(currentProduct.price));
            }
            
            // Feedback visual
            this.innerHTML = '<i class="fas fa-check"></i> Agregado';
            this.style.backgroundColor = '#C6FF00';
            this.style.color = '#000';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-shopping-bag"></i> Agregar al carrito';
                this.style.backgroundColor = '';
                this.style.color = '';
                closeModal();
            }, 1500);
        }
    });
    
    // Comprar ahora desde modal
    document.getElementById('modalBuyNow').addEventListener('click', function() {
        if (currentProduct && currentProduct.price) {
            const totalPrice = parseInt(currentProduct.price) * quantity;
            const productName = `${currentProduct.name} - Talla: ${selectedSize}, Color: ${selectedColor}`;
            
            // Agregar al carrito
            for (let i = 0; i < quantity; i++) {
                addToCart(productName, parseInt(currentProduct.price));
            }
            
            // Abrir WhatsApp
            let message = '¡Hola! Quiero hacer un pedido:\n\n';
            message += `Producto: ${productName}\n`;
            message += `Cantidad: ${quantity}\n`;
            message += `Total: $${totalPrice.toLocaleString()} COP`;
            
            const whatsappUrl = `https://wa.me/573214710122?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            closeModal();
        }
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && productModal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ===================================
// Console message
// ===================================
console.log('%c🔥 NEXVIBE 🔥', 'font-size: 24px; font-weight: bold; color: #00AEEF;');
console.log('%cLa nueva vibra del streetwear', 'font-size: 14px; color: #808080;');
console.log('%c¿Buscas trabajo como developer? Contáctanos en hola@nexvibe.co', 'font-size: 12px; color: #C6FF00;');

