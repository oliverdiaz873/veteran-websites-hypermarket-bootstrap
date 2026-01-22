// Scroll-Driven Scale Animation progresiva para sección Sobre Nosotros
document.addEventListener('DOMContentLoaded', function() {
    const sobreNosotrosSection = document.querySelector('.sobre-nosotros');
    
    if (!sobreNosotrosSection) return;
    
    // Detectar si es móvil
    function isMobile() {
        return window.innerWidth <= 767.98;
    }
    
    // Función para actualizar la escala basada en la posición de scroll
    function updateScale() {
        const rect = sobreNosotrosSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calcular qué porcentaje de la sección es visible
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;
        const sectionHeight = rect.height;
        
        // Determinar el progreso de visibilidad (0 a 1)
        let progress = 0;
        
        if (sectionTop <= windowHeight && sectionBottom >= 0) {
            // La sección está en el viewport
            if (sectionTop >= 0) {
                // La sección está entrando desde abajo
                // Calcular progreso basado en cuánto ha entrado
                const visibleHeight = Math.min(sectionHeight, windowHeight - sectionTop);
                progress = visibleHeight / sectionHeight;
            } else {
                // La sección ya está completamente en viewport
                progress = 1;
            }
        }
        
        // Asegurar que el progreso esté entre 0 y 1
        progress = Math.max(0, Math.min(1, progress));
        
        // Para debugging - mostrar en consola
        console.log('Progress:', progress.toFixed(2), 'SectionTop:', sectionTop.toFixed(2), 'WindowHeight:', windowHeight, 'IsMobile:', isMobile());
        
        // Actualizar clases basadas en el progreso y dispositivo
        if (isMobile()) {
            // Móvil: solo 2 fases pero más rápidas (20% y 70% para cubrir ancho antes)
            sobreNosotrosSection.classList.remove('scale-50', 'scale-100');
            
            if (progress >= 0.2) sobreNosotrosSection.classList.add('scale-50');
            if (progress >= 0.7) sobreNosotrosSection.classList.add('scale-100');
        } else {
            // Desktop/Tablet: 3 fases (33%, 66% y 100%)
            sobreNosotrosSection.classList.remove('scale-33', 'scale-66', 'scale-100');
            
            if (progress >= 0.33) sobreNosotrosSection.classList.add('scale-33');
            if (progress >= 0.66) sobreNosotrosSection.classList.add('scale-66');
            if (progress >= 1.0) sobreNosotrosSection.classList.add('scale-100');
        }
    }
    
    // Event listeners
    window.addEventListener('scroll', updateScale);
    window.addEventListener('resize', updateScale);
    
    // Inicializar
    updateScale();
});
