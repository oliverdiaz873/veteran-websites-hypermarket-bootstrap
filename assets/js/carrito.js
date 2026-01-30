document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'carrito';

    // Cargar carrito desde localStorage o iniciar vacío
    let carrito = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // LIMPIEZA DE SEGURIDAD
    carrito = carrito.filter(p => p && p.id);
    guardarCarrito();

    // === Funciones para carrito ===
    function guardarCarrito() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    }

    function calcularTotalUnidades() {
        return carrito.reduce((sum, p) => sum + p.cantidad, 0);
    }

    function calcularTotalPrecio() {
        return carrito.reduce((sum, p) => sum + p.cantidad * p.precio, 0);
    }

    function agregarProducto(producto) {
        const existente = carrito.find(p => p.id === producto.id);
        if (existente) {
            existente.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        guardarCarrito();
        actualizarUI();
    }

    function eliminarProducto(id) {
        carrito = carrito.filter(p => p.id !== id);
        guardarCarrito();
        actualizarUI();
    }

    function cambiarCantidad(id, delta) {
        const item = carrito.find(p => p.id === id);
        if (!item) return;
        item.cantidad += delta;
        if (item.cantidad <= 0) eliminarProducto(id);
        else {
            guardarCarrito();
            actualizarUI();
        }
    }

    function escapeHtml(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/[&<>"']/g, m =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[m])
        );
    }

    // === Actualizar UI del carrito y contador ===
    function actualizarUI() {
        const contadorCarrito = document.getElementById('contador-carrito');
        if (contadorCarrito) contadorCarrito.textContent = calcularTotalUnidades();

        const totalUnidadesEl = document.getElementById('total-unidades');
        if (totalUnidadesEl) totalUnidadesEl.textContent = calcularTotalUnidades();

        const totalCarritoEl = document.getElementById('total-carrito');
        if (totalCarritoEl) totalCarritoEl.textContent = calcularTotalPrecio().toLocaleString();

        const listaCarrito = document.getElementById('lista-carrito');
        if (listaCarrito) renderizarCarrito(listaCarrito);
    }

    function renderizarCarrito(listaCarrito) {
        if (carrito.length === 0) {
            listaCarrito.innerHTML = '<p>Tu carrito está vacío.</p>';
            return;
        }

        listaCarrito.innerHTML = carrito.map(p => {
            const subtotal = p.precio * p.cantidad;

            // Ajustar ruta de imagen para soporte local (file://) y diferentes subdirectorios
            let imgBtn = p.img;
            if (imgBtn.startsWith('/')) {
                // Detectar si estamos en pages/cart/
                const isInCartPage = window.location.pathname.includes('/pages/cart/');
                const isInSubDir = window.location.pathname.includes('/categorias/') || window.location.pathname.includes('/productos/');
                
                if (isInCartPage) {
                    // Desde pages/cart/ necesitamos ir 3 niveles arriba para llegar a assets/
                    imgBtn = '../../..' + imgBtn;
                } else if (isInSubDir) {
                    // Desde categorias/ o productos/ necesitamos ir 2 niveles arriba
                    imgBtn = '..' + imgBtn;
                } else {
                    // Desde root, quitar '/' inicial
                    imgBtn = imgBtn.substring(1);
                }
            }

            const contenido = `
                <img src="${escapeHtml(imgBtn)}" alt="${escapeHtml(p.nombre)}" class="item-img">
                <strong>${escapeHtml(p.nombre)}</strong>
            `;
            return `
                <div class="item-carrito" data-id="${escapeHtml(p.id)}">
                    <div class="carrito-item-info">
                        ${p.url
                    ? `<a href="${getRelativePrefix() + escapeHtml(p.url)}" class="carrito-link">${contenido}</a>`
                    : contenido}
                        <div>RD$ ${p.precio.toLocaleString()}</div>
                    </div>
                    <div class="carrito-item-cantidad">
                        <button class="btn-decrease">−</button>
                        <span>${p.cantidad}</span>
                        <button class="btn-increase">+</button>
                    </div>
                    <div>RD$ ${subtotal.toLocaleString()}</div>
                    <button class="btn-eliminar">Eliminar</button>
                </div>
            `;
        }).join('');
    }

    // === Delegación de eventos para agregar productos ===
    // === Delegación de eventos para agregar productos (FUENTE ÚNICA) ===
    document.addEventListener('click', e => {
        const btn = e.target.closest('.btn-agregar, .btn-agregar-producto');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        const id = btn.id;
        if (!id) return;

        // 🔥 siempre tomar el producto real desde productos[]
        const producto = productos.find(p => p.id === id);
        if (!producto) return;

        agregarProducto({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            img: producto.imagen,
            url: producto.url
        });
    });



    // === Delegación de eventos dentro del carrito ===
    document.addEventListener('click', e => {
        const itemEl = e.target.closest('.item-carrito');
        if (!itemEl) return;

        const id = itemEl.dataset.id;

        if (e.target.closest('button')) {
            e.preventDefault();
            e.stopPropagation();

            if (e.target.classList.contains('btn-eliminar')) eliminarProducto(id);
            if (e.target.classList.contains('btn-increase')) cambiarCantidad(id, 1);
            if (e.target.classList.contains('btn-decrease')) cambiarCantidad(id, -1);
            return;
        }

        const link = itemEl.querySelector('.carrito-link');
        if (link) window.location.href = link.href;
    });

    // === Inicializar UI al cargar la página ===
    actualizarUI();
});

// Función para obtener el prefijo relativo según la profundidad del directorio
function getRelativePrefix() {
    const path = window.location.pathname;

    if (path.includes('/productos/')) {
        const parts = path.split('/productos/');
        if (parts.length > 1) {
            const subPath = parts[1];
            const depth = subPath.split('/').length - 1;
            let up = '../';
            for (let i = 0; i < depth; i++) up += '../';
            return up;
        }
        return '../';
    }

    if (path.includes('/categorias/')) {
        return '../';
    }

    if (path.includes('/pages/search/')) {
        return '../../';
    }

    if (path.includes('/pages/cart/')) {
        return '../../../';
    }

    if (path.includes('/legal/')) {
        return '../';
    }

    if (path.includes('/contacto/')) {
        return '../';
    }

    return ''; // Root
}
