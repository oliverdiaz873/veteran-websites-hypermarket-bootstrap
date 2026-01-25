// Animación para las secciones con clase .reveal que se activa con scroll
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todas las secciones con la clase .reveal
    const revealSections = document.querySelectorAll('.reveal');
    
    if (revealSections.length === 0) return;
    
    // Configurar Intersection Observer para cada sección
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Cuando la sección es visible, agregar la clase 'active'
                entry.target.classList.add('active');
            } else {
                // Cuando la sección no es visible, quitar la clase 'active'
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.2 // Activar cuando 20% de la sección sea visible
    });
    
    // Empezar a observar todas las secciones
    revealSections.forEach(section => {
        observer.observe(section);
    });
});
