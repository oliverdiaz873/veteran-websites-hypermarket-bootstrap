// Scroll suave con ajuste de posición ideal para secciones
document.addEventListener('DOMContentLoaded', function() {
    
    // Función para hacer scroll suave a una sección con ajuste de altura
    function smoothScrollToSection(sectionId, offset = 80) {
        const section = document.getElementById(sectionId);
        
        if (section) {
            // Calcular la posición ideal
            const sectionTop = section.offsetTop - offset;
            
            // Hacer scroll suave
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
            
            // Agregar clase temporal para resaltar la sección
            section.classList.add('section-highlighted');
            
            // Remover la clase después de la animación
            setTimeout(() => {
                section.classList.remove('section-highlighted');
            }, 2000);
        }
    }
    
    // Manejar clicks en enlaces que apuntan a anclas
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href*="#"]');
        
        if (link) {
            const href = link.getAttribute('href');
            
            // Verificar si es un enlace interno a una sección
            if (href.includes('#')) {
                const sectionId = href.split('#')[1];
                
                // Evitar comportamiento default si encontramos la sección
                if (sectionId && document.getElementById(sectionId)) {
                    e.preventDefault();
                    
                    // Pequeña pausa para asegurar que la página cargue
                    setTimeout(() => {
                        smoothScrollToSection(sectionId);
                    }, 100);
                }
            }
        }
    });
    
    // Manejar el caso específico de venir de otra página con hash en la URL
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        
        // Esperar a que la página cargue completamente
        setTimeout(() => {
            smoothScrollToSection(sectionId);
        }, 500);
    }
});
