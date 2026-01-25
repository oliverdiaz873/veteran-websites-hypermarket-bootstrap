// Menú multinivel por clic para tablets (768px - 1199px)
// Rango: Tablets estándar incluyendo iPad en modo retrato y landscape
// Cubre: iPad Mini (768-1024px), iPad Air (820-1180px), iPad Pro 11" (834-1194px)
// También cubre Surface Go (768-1366px), Samsung Galaxy Tab (800-1280px), Google Nest Hub (1024-1280px)
document.addEventListener('DOMContentLoaded', function() {
    // Detectar si está en el rango de tablets
    function isTablet() {
        const width = window.innerWidth;
        return width >= 768 && width <= 1199;
    }
    
    if (!isTablet()) return;
    
    console.log('Modo tablet detectado - Menú por clic activado');
    
    // Encontrar todos los enlaces que tienen submenús
    const nivel2Links = document.querySelectorAll('.nav-links > ul > li:has(ul) > a');
    const nivel3Links = document.querySelectorAll('.nav-links > ul > li > ul > li:has(ul) > a');
    
    console.log('Enlaces nivel 2 encontrados:', nivel2Links.length);
    console.log('Enlaces nivel 3 encontrados:', nivel3Links.length);
    nivel2Links.forEach((link, i) => console.log(`Nivel 2 ${i}:`, link.textContent.trim()));
    nivel3Links.forEach((link, i) => console.log(`Nivel 3 ${i}:`, link.textContent.trim()));
    
    // Agregar botón "Ver todos los productos" a cada submenú de nivel 3
    function agregarVerTodosLosProductos() {
        console.log('=== Iniciando agregarVerTodosLosProductos ===');
        
        // Encontrar todos los enlaces de nivel 2 que tienen submenús de nivel 3
        const nivel2Links = document.querySelectorAll('.nav-links > ul > li > ul > li:has(ul) > a');
        console.log('Enlaces de nivel 2 con submenús encontrados:', nivel2Links.length);
        
        nivel2Links.forEach((nivel2Link, index) => {
            const parentLi = nivel2Link.parentElement;
            const submenu = parentLi.querySelector('ul'); // Este es el submenú de nivel 3
            const href = nivel2Link.getAttribute('href') || '#';
            const parentText = nivel2Link.textContent.trim();
            
            console.log(`Procesando nivel 2 ${index}: ${parentText} -> ${href}`);
            
            if (!submenu) {
                console.log(`✗ No se encontró submenú de nivel 3 para ${parentText}`);
                return;
            }
            
            // Verificar si ya existe el botón para evitar duplicados
            const existingBtn = submenu.querySelector('.ver-todos-btn');
            if (existingBtn) {
                console.log(`Botón ya existe para ${parentText}, omitiendo`);
                return;
            }
            
            // Crear el botón "Ver todos los productos" para esta sección
            const verTodosLi = document.createElement('li');
            verTodosLi.className = 'ver-todos-btn';
            verTodosLi.innerHTML = `
                <a href="${href}" style="
                    border-top: 1px solid rgba(255,255,255,0.2); 
                    margin-top: 5px; 
                    padding-top: 8px; 
                    color: #ffcc00; 
                    font-weight: bold;
                    text-align: center;
                    display: block;
                    width: 100%;
                ">
                    Ver todos los productos ▸
                </a>
            `;
            
            // Agregar al final del submenú de nivel 3
            submenu.appendChild(verTodosLi);
            
            console.log(`✓ Botón "Ver todos los productos" agregado para: ${parentText}`);
            
            // Verificar que se agregó correctamente
            const addedBtn = submenu.querySelector('.ver-todos-btn a');
            if (addedBtn) {
                console.log(`✓ Botón verificado - href: ${addedBtn.getAttribute('href')}`);
            } else {
                console.log(`✗ Error: Botón no se agregó correctamente para ${parentText}`);
            }
        });
        
        console.log('=== agregarVerTodosLosProductos completado ===');
    }
    
    // Llamar a la función para agregar los botones
    agregarVerTodosLosProductos();
    
    // Manejar clics en nivel 2 - SOLO abrir submenú, no navegar
    console.log('Agregando event listeners a nivel 2...');
    nivel2Links.forEach((link, index) => {
        console.log(`Configurando listener para nivel 2 ${index}:`, link.textContent.trim());
        link.addEventListener('click', function(e) {
            console.log('Click detectado en nivel 2:', this.textContent.trim());
            e.preventDefault();
            e.stopPropagation();
            
            const parentLi = this.parentElement;
            const submenu = parentLi.querySelector('ul');
            
            if (!submenu) {
                console.log('No se encontró submenú para:', this.textContent.trim());
                return;
            }
            
            // Cerrar todos los demás submenús de nivel 2
            document.querySelectorAll('.nav-links > ul > li > ul').forEach(otherSubmenu => {
                if (otherSubmenu !== submenu) {
                    otherSubmenu.classList.remove('tablet-active');
                }
            });
            
            // Alternar submenú actual
            submenu.classList.toggle('tablet-active');
            
            console.log('Clic nivel 2:', this.textContent.trim(), 'Submenú activo:', submenu.classList.contains('tablet-active'));
        });
    });
    
    console.log('Event listeners de nivel 2 configurados');
    
    // Manejar clics en nivel 3 - SOLO abrir submenú, no navegar
    nivel3Links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parentLi = this.parentElement;
            const submenu = parentLi.querySelector('ul');
            
            if (!submenu) return;
            
            // Cerrar todos los demás submenús de nivel 3
            document.querySelectorAll('.nav-links > ul > li > ul > li > ul').forEach(otherSubmenu => {
                if (otherSubmenu !== submenu) {
                    otherSubmenu.classList.remove('tablet-active');
                }
            });
            
            // Alternar submenú actual
            submenu.classList.toggle('tablet-active');
            
            console.log('Clic nivel 3:', this.textContent.trim(), 'Submenú activo:', submenu.classList.contains('tablet-active'));
        });
    });
    
    // Cerrar menús al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-links')) {
            document.querySelectorAll('.nav-links ul').forEach(submenu => {
                submenu.classList.remove('tablet-active');
            });
        }
    });
    
    // Prevenir navegación en enlaces que no tienen submenús pero están en el contenedor
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (!link.closest('li:has(ul)')) {
            // Enlaces sin submenús navegan normalmente
            console.log('Enlace sin submenú:', link.textContent.trim());
        }
    });
});
