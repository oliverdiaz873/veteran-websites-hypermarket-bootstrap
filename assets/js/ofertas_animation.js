// Animación para la sección de ofertas que se activa con scroll
document.addEventListener('DOMContentLoaded', function() {
    const ofertasSection = document.querySelector('#ofertas.reveal');
    
    if (!ofertasSection) return;
    
    // Configurar Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Cuando la sección es visible, agregar la clase 'active'
                ofertasSection.classList.add('active');
            } else {
                // Cuando la sección no es visible, quitar la clase 'active'
                ofertasSection.classList.remove('active');
            }
        });
    }, {
        threshold: 0.2 // Activar cuando 20% de la sección sea visible
    });
    
    // Empezar a observar la sección
    observer.observe(ofertasSection);
});
