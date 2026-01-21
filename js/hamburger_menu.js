
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.querySelector('.nav-links-mobile');

    if (!menuBtn) {
        return;
    }
    
    if (!mobileMenu) {
        return;
    }

    // Abrir / cerrar menú móvil
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('show');
        
        // Forzar visibilidad directa
        if (mobileMenu.classList.contains('show')) {
            mobileMenu.style.display = 'block';
        } else {
            mobileMenu.style.display = 'none';
        }
    });

    // Evitar cierre al hacer click dentro del menú
    mobileMenu.addEventListener('click', (e) => e.stopPropagation());

    // Submenús móviles - manejo simplificado
    // Encontrar todos los enlaces que tienen submenús inmediatamente después
    const allLinksWithSubmenu = mobileMenu.querySelectorAll('a + ul');
    
    allLinksWithSubmenu.forEach(ul => {
        const parentLink = ul.previousElementSibling; // El enlace justo antes del UL
        
        if (parentLink && parentLink.tagName === 'A') {
            parentLink.addEventListener('click', function(e) {
                e.preventDefault(); // Siempre prevenir navegación para enlaces con submenú
                
                const parentLi = this.parentElement;
                
                // Alterna submenú actual
                parentLi.classList.toggle('show');
                
                // Solo cerrar submenús hermanos que también tienen submenús (no los elementos del nivel 2)
                const parentContainer = parentLi.parentElement;
                const siblingSubmenus = Array.from(parentContainer.children)
                    .filter(li => li !== parentLi && li.querySelector('ul'));
                
                siblingSubmenus.forEach(sib => sib.classList.remove('show'));
            });
        }
    });

    // Cierra menú si se hace click fuera
    document.addEventListener('click', () => {
        mobileMenu.classList.remove('show');
        const openSubs = mobileMenu.querySelectorAll('li.show');
        openSubs.forEach(li => li.classList.remove('show'));
    });
});



