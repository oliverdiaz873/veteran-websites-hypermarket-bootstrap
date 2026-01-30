document.addEventListener("DOMContentLoaded", function () {

    const btnBuscar = document.getElementById("btn-buscar");
    const inputBuscar = document.getElementById("input-buscar");
    const resultados = document.getElementById("resultados-busqueda");
    // Debug: Verificar que los elementos existen
    console.log('Debug - Elementos del buscador:', {
        btnBuscar,
        inputBuscar,
        resultados
    });
    // Debug: Detectar si estamos en móvil
    const isMobile = window.innerWidth <= 767;
    console.log('Debug - Es móvil:', isMobile);
    // Debug: Verificar si hay múltiples inputs
    const allInputs = document.querySelectorAll('#input-buscar');
    console.log('Debug - Todos los inputs encontrados:', allInputs.length, allInputs);
    // Debug: Verificar si hay múltiples resultados
    const allResultados = document.querySelectorAll('.resultados-busqueda');
    console.log('Debug - Todos los resultados encontrados:', allResultados.length, allResultados);
    
    // Debug: Verificar si los productos están cargados
    console.log('Debug - Productos cargados:', typeof productos !== 'undefined' ? productos.length : 'NO DEFINIDO');
    if (typeof productos !== 'undefined') {
        console.log('Debug - Primer producto:', productos[0]);
        console.log('Debug - Algunos nombres de productos:', productos.slice(0, 5).map(p => p.nombre));
    }
    const body = document.body;
    const contenedorResultados = document.getElementById("lista-resultados");
    const tituloResultados = document.getElementById("titulo-resultados");
    const sinResultados = document.getElementById("sin-resultados");

    /**********************
     * CARRO DE COMPRAS
     **********************/
    const STORAGE_KEY = 'carrito';
    const listaCarrito = document.getElementById('lista-carrito');
    const contadorCarrito = document.getElementById('contador-carrito');
    const totalCarritoEl = document.getElementById('total-carrito');

    let carrito = cargarCarrito();

    function cargarCarrito() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    function guardarCarrito() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    }

    function actualizarContadorCarrito() {
        const totalUnidades = carrito.reduce((s, it) => s + (it.cantidad || 0), 0);
        if (contadorCarrito) {
            contadorCarrito.textContent = totalUnidades;
        }
    }

    function renderizarCarrito() {
        if (!listaCarrito) {
            actualizarContadorCarrito();
            return;
        }

        if (carrito.length === 0) {
            listaCarrito.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            listaCarrito.innerHTML = carrito.map(item => {
                const subtotal = (Number(item.precio) || 0) * (item.cantidad || 0);

                // Resolver ruta de imagen (local logic)
                let imgSrc = item.img || '';
                if (imgSrc.startsWith('/')) {
                    imgSrc = getRelativePrefix() + imgSrc.substring(1);
                }

                // Resolver URL del producto para enlace
                let itemUrl = item.url ? (getRelativePrefix() + item.url) : '#';

                const contenidoInfo = `
                     ${imgSrc ? `<img src="${imgSrc}" class="item-img" style="width: 50px; height: 50px; object-fit: contain; margin-right: 10px;">` : ''}
                    <div>
                        <strong>${escapeHtml(item.nombre)}</strong>
                        <div>RD$ ${Number(item.precio).toLocaleString()}</div>
                    </div>
                `;

                return `
                    <div class="item-carrito" data-id="${escapeHtml(item.id)}">
                        <div class="carrito-item-info">
                            <a href="${itemUrl}" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
                                ${contenidoInfo}
                            </a>
                        </div>
                        <div class="carrito-item-cantidad">
                            <button class="btn-decrease">−</button>
                            <span>${item.cantidad}</span>
                            <button class="btn-increase">+</button>
                        </div>
                        <div class="carrito-item-subtotal">
                            RD$ ${Number(subtotal).toLocaleString()}
                        </div>
                        <button class="btn-eliminar">Eliminar</button>
                    </div>
                `;
            }).join('');
        }

        const total = carrito.reduce(
            (sum, it) => sum + (Number(it.precio) || 0) * (it.cantidad || 0),
            0
        );

        if (totalCarritoEl) {
            totalCarritoEl.textContent = Number(total).toLocaleString();
        }

        actualizarContadorCarrito();
    }

    function agregarProducto(producto) {
        const existente = carrito.find(i => i.id === producto.id);

        if (existente) {
            existente.cantidad += 1;
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: Number(producto.precio) || 0,
                img: producto.img, // Save image
                url: producto.url, // Save URL for navigation
                cantidad: 1
            });
        }

        guardarCarrito();
        renderizarCarrito();
    }

    function eliminarProducto(id) {
        carrito = carrito.filter(i => i.id !== id);
        guardarCarrito();
        renderizarCarrito();
    }

    function cambiarCantidad(id, delta) {
        const item = carrito.find(i => i.id === id);
        if (!item) return;

        item.cantidad += delta;
        if (item.cantidad <= 0) {
            eliminarProducto(id);
        } else {
            guardarCarrito();
            renderizarCarrito();
        }
    }

    function escapeHtml(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/[&<>\"']/g, m =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[m])
        );
    }

    window.toggleCarrito = function () {
        const carritoEl = document.getElementById('carrito');
        if (carritoEl) carritoEl.classList.toggle('activo');
    };

    // Delegación global (Agregar / Carrito)
    document.addEventListener('click', (e) => {

        const btnAgregar = e.target.closest('.btn-agregar');
        if (btnAgregar) {
            e.preventDefault();
            e.stopPropagation(); // Avoid conflict with global carrito.js

            const id = btnAgregar.dataset.id || btnAgregar.id;
            // Lookup product to get all details including image
            const productoReal = productos.find(p => p.id === id);

            if (productoReal) {
                agregarProducto({
                    id: productoReal.id,
                    nombre: productoReal.nombre,
                    precio: productoReal.precio,
                    img: productoReal.imagen, // Map imagen to img
                    url: productoReal.url     // Save URL
                });
            } else {
                // Fallback (shouldn't happen if IDs match)
                agregarProducto({
                    id: id,
                    nombre: btnAgregar.dataset.nombre,
                    precio: btnAgregar.dataset.precio,
                    img: btnAgregar.dataset.img || '',
                    url: btnAgregar.dataset.url || '#'
                });
            }
            return;
        }

        const itemEl = e.target.closest('.item-carrito');
        if (!itemEl) return;

        const id = itemEl.dataset.id;

        if (e.target.classList.contains('btn-eliminar')) eliminarProducto(id);
        if (e.target.classList.contains('btn-increase')) cambiarCantidad(id, 1);
        if (e.target.classList.contains('btn-decrease')) cambiarCantidad(id, -1);
    });

    /**********************
     * BUSCADOR
     **********************/
    if (btnBuscar && inputBuscar) {
        const iconoBuscar = document.getElementById("icono-buscar");

        btnBuscar.addEventListener("click", () => {
            const activo = body.classList.toggle("menu-busqueda-activa");

            if (activo) {
                // Cambiar a icono X
                iconoBuscar.classList.remove("bi-search");
                iconoBuscar.classList.add("bi-x-lg");
                iconoBuscar.alt = "Cerrar búsqueda";
                inputBuscar.focus();
            } else {
                // Volver a icono Lupa
                iconoBuscar.classList.remove("bi-x-lg");
                iconoBuscar.classList.add("bi-search");
                iconoBuscar.alt = "Buscar";
                inputBuscar.value = "";
                resultados.style.display = "none";
            }
        });
    }

    if (inputBuscar && resultados) {
        inputBuscar.addEventListener("input", () => {
            const valor = normalizarTexto(inputBuscar.value);
            resultados.innerHTML = "";

            console.log("Input value:", inputBuscar.value); // Debug
            console.log("Valor normalizado:", valor); // Debug

            if (!valor) {
                resultados.classList.remove("mostrar-resultados");
                resultados.style.setProperty("display", "none", "important"); // Ocultar con setProperty
                return;
            }

            const coincidencias = productos.filter(p =>
                normalizarTexto(p.nombre).includes(valor)
            );

            console.log("Coincidencias encontradas:", coincidencias.length); // Debug

            if (coincidencias.length === 0) {
                resultados.classList.remove("mostrar-resultados");
                resultados.style.setProperty("display", "none", "important"); // Ocultar con setProperty
                return;
            }

            coincidencias.forEach(p => {
                const li = document.createElement("li");
                li.className = "item-busqueda";

                // Resolver ruta relativa para la imagen
                let imgSrc = p.imagen;
                if (imgSrc.startsWith('/')) {
                    imgSrc = getRelativePrefix() + imgSrc.substring(1);
                }

                // Crear HTML con manejo de error de imagen
                li.innerHTML = `
                    <div class="resultado-item">
                        <img src="${imgSrc}" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" 
                             style="width: 40px; height: 40px; object-fit: cover; margin-right: 10px;">
                        <div class="resultado-placeholder" style="display: none; width: 40px; height: 40px; background: #f0f0f0; border-radius: 4px; margin-right: 10px; align-items: center; justify-content: center; color: #666; font-size: 12px;">
                            📦
                        </div>
                        <span style="color: white !important;">${escapeHtml(p.nombre)}</span>
                    </div>
                `;
                li.addEventListener("click", () => irAResultados(p.nombre));
                resultados.appendChild(li);
            });

            resultados.classList.add("mostrar-resultados");
            resultados.style.setProperty("display", "block", "important"); // Forzar con setProperty
            
            // Intento adicional con setTimeout por si hay conflicto de timing
            setTimeout(() => {
                resultados.style.setProperty("display", "block", "important");
                console.log("Forzado display con setTimeout"); // Debug
            }, 10);
            
            console.log("Clase mostrar-resultados agregada"); // Debug
            console.log("Resultados HTML:", resultados.innerHTML); // Debug
            console.log("Clases del contenedor:", resultados.className); // Debug
            console.log("Estilo computed del contenedor:", window.getComputedStyle(resultados).display); // Debug
            console.log("Estilo computed visibility:", window.getComputedStyle(resultados).visibility); // Debug
            console.log("Estilo computed opacity:", window.getComputedStyle(resultados).opacity); // Debug
        });

        inputBuscar.addEventListener("keydown", e => {
            if (e.key === "Enter" && inputBuscar.value.trim()) {
                irAResultados(inputBuscar.value);
            }
        });
    }

    /**********************
     * RESULTADOS
     **********************/
    if (contenedorResultados && tituloResultados && sinResultados) {
        const params = new URLSearchParams(window.location.search);
        const query = params.get("q") || "";

        tituloResultados.textContent = `Resultados para: "${query}"`;

        const coincidencias = productos.filter(p =>
            normalizarTexto(p.nombre).includes(normalizarTexto(query))
        );

        if (coincidencias.length === 0) {
            sinResultados.style.display = "block";
            return;
        }

        sinResultados.style.display = "none";

        coincidencias.forEach(p => {
            const card = document.createElement("div");
            card.className = "resultado-card";

            // Resolver ruta relativa para la imagen
            let imgSrc = p.imagen;
            if (imgSrc.startsWith('/')) {
                imgSrc = getRelativePrefix() + imgSrc.substring(1);
            }

            card.innerHTML = `
                 <img src="${imgSrc}">
                     <div class="resultado-info">
                           <h3>${p.nombre}</h3>
                     <div class="resultado-precio">
                            ${p.precioTexto || "RD$ " + p.precio}
                     </div>
                      <button class="btn-agregar"
                        id="${p.id}"
                        data-id="${p.id}"
                        data-nombre="${p.nombre}"
                        data-precio="${p.precio}"
                        data-url="${p.url || '#'}"
                        data-img="${p.imagen}">
                         Agregar
                     </button>
                   </div>
                 `;

            card.addEventListener("click", e => {
                if (!e.target.closest('.btn-agregar')) {
                    // Fix: usar prefijo relativo para la URL del producto
                    window.location.href = getRelativePrefix() + p.url;
                }
            });

            contenedorResultados.appendChild(card);
        });
    }

    renderizarCarrito();
});

/************ UTILIDADES ************/
function normalizarTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function irAResultados(texto) {
    const q = encodeURIComponent(texto.trim());
    // Redirigir a pages/search/index.html con la ruta relativa correcta
    window.location.href = getRelativePrefix() + `pages/search/index.html?q=${q}`;
}

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

    if (path.includes('/contacto/')) {
        return '../';
    }

    return ''; // Root
}
