// Botones del carrusel para la navegación de productos destacados y ofertas 
document.addEventListener('DOMContentLoaded', function() {
    // Configurar para productos destacados
    setupCarousel('productos');
    
    // Configurar para ofertas
    setupCarousel('ofertas');
    
    // Configurar para secciones de Alimentos
    setupCarousel('frutas_y_verduras');
    setupCarousel('carnes_pescados_mariscos');
    setupCarousel('despensa');
    setupCarousel('lacteos_y_huevos');
    setupCarousel('bebidas');
    setupCarousel('enlatados');
    
    // Configurar para secciones de Electrodomésticos
    setupCarousel('cocina');
    setupCarousel('lavado');
    setupCarousel('climatizacion');
    
    // Configurar para secciones de Farmacia
    setupCarousel('analgesicos');
    setupCarousel('dermocosmetica');
    setupCarousel('vitaminas_y_minerales');
    setupCarousel('antigripales_y_resfriado');
    
    function setupCarousel(type) {
        const container = document.querySelector(`#${type}.productos-destacados .productos-container`) || 
                         document.querySelector(`.productos-destacados .productos-container`);
        const prevBtn = document.getElementById(`${type}-prev`);
        const nextBtn = document.getElementById(`${type}-next`);
        
        if (!container || !prevBtn || !nextBtn) return;
        
        // Calcular el ancho de un producto incluyendo el gap
        const firstProduct = container.querySelector('.producto');
        const containerStyle = window.getComputedStyle(container);
        const gap = parseInt(containerStyle.gap) || 20;
        const scrollAmount = firstProduct ? firstProduct.offsetWidth + gap : 220;
        
        // Función para desplazarse
        function scroll(direction) {
            const currentScroll = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;
            
            if (direction === 'prev') {
                container.scrollTo({
                    left: Math.max(0, currentScroll - scrollAmount),
                    behavior: 'smooth'
                });
            } else {
                container.scrollTo({
                    left: Math.min(maxScroll, currentScroll + scrollAmount),
                    behavior: 'smooth'
                });
            }
        }
        
        // Event listeners
        prevBtn.addEventListener('click', () => scroll('prev'));
        nextBtn.addEventListener('click', () => scroll('next'));
        
        // Actualizar estado de los botones según la posición del scroll
        function updateButtonStates() {
            const currentScroll = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;
            
            // Deshabilitar botón anterior si está al inicio
            prevBtn.style.opacity = currentScroll <= 0 ? '0.5' : '1';
            prevBtn.style.cursor = currentScroll <= 0 ? 'not-allowed' : 'pointer';
            
            // Deshabilitar botón siguiente si está al final
            nextBtn.style.opacity = currentScroll >= maxScroll ? '0.5' : '1';
            nextBtn.style.cursor = currentScroll >= maxScroll ? 'not-allowed' : 'pointer';
        }
        
        // Actualizar estados al hacer scroll
        container.addEventListener('scroll', updateButtonStates);
        
        // Actualizar estados inicialmente
        updateButtonStates();
        
        // También actualizar al cambiar el tamaño de la ventana
        window.addEventListener('resize', updateButtonStates);
    }
});
