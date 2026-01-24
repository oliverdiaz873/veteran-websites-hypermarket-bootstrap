const formulario = document.getElementById("formulario-contacto");  // getElementById es un método del objeto document que permite obtener un elemento HTML del DOM usando su atributo id y almacenarlo en una variable.

// Función para mostrar Toast Notification - Simplificada
function mostrarToast(mensaje) {
    const toast = document.getElementById("mi-toast");
    
    // Actualizar mensaje
    toast.textContent = mensaje;
    
    // Mostrar con animación
    toast.classList.add("mostrar");
    
    // Auto-eliminar después de 2.5 segundos
    setTimeout(() => {
        toast.classList.remove("mostrar");
    }, 2500);
    
    // Clic para cerrar (opcional)
    toast.addEventListener("click", () => {
        toast.classList.remove("mostrar");
    }, { once: true });
}

// Función para validar un campo específico en tiempo real
function validarCampoEnTiempoReal(campoId, valor, errorId, tipoValidacion) {
    const campo = document.getElementById(campoId);
    const errorElement = document.getElementById(errorId);
    let esValido = true;
    let mensajeError = "";

    // Limpiar mensaje de error y clase
    errorElement.textContent = "";
    campo.classList.remove("invalid-value");

    // Validar según el tipo
    switch(tipoValidacion) {
        case 'nombre':
            if (valor === "") {
                esValido = true; // Vacío es válido mientras se escribe
            } else if (valor.length < 2 || valor.length > 50) {
                esValido = false;
                mensajeError = "El nombre debe tener entre 2 y 50 caracteres";
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
                esValido = false;
                mensajeError = "El nombre solo puede contener letras y espacios";
            }
            break;
            
        case 'email':
            if (valor === "") {
                esValido = true; // Vacío es válido mientras se escribe
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                esValido = false;
                mensajeError = "El formato del email no es válido";
            }
            break;
            
        case 'telefono':
            if (valor === "") {
                esValido = true; // Vacío es válido (opcional)
            } else {
                let telefonoLimpio = valor.replace(/[\s\-\(\)]/g, '');
                if (!/^[0-9]{8,15}$/.test(telefonoLimpio)) {
                    esValido = false;
                    mensajeError = "El teléfono debe contener entre 8 y 15 dígitos";
                }
            }
            break;
            
        case 'mensaje':
            if (valor === "") {
                esValido = true; // Vacío es válido mientras se escribe
            } else if (valor.length < 10 || valor.length > 500) {
                esValido = false;
                mensajeError = "El mensaje debe tener entre 10 y 500 caracteres";
            }
            break;
    }

    // Aplicar estilos si hay valor y es inválido
    if (!esValido && valor !== "") {
        errorElement.textContent = mensajeError;
        campo.classList.add("invalid-value");
    }

    return esValido;
}

// Agregar eventos de validación en tiempo real
document.getElementById("nombre").addEventListener("input", function() {
    validarCampoEnTiempoReal("nombre", this.value.trim(), "errorNombre", "nombre");
});

document.getElementById("email").addEventListener("input", function() {
    validarCampoEnTiempoReal("email", this.value.trim(), "errorEmail", "email");
});

document.getElementById("telefono").addEventListener("input", function() {
    validarCampoEnTiempoReal("telefono", this.value.trim(), "errorTelefono", "telefono");
});

document.getElementById("mensaje").addEventListener("input", function() {
    validarCampoEnTiempoReal("mensaje", this.value.trim(), "errorMensaje", "mensaje");
});

formulario.addEventListener("submit", function (e) {
    // addEventListener es un método del objeto EventTarget que se usa para asignar un evento a un elemento HTML.
    // en el primer parámetro se especifica el tipo de evento, en este caso 'submit' que se activa al hacer clic en el boton type="submit" del formulario.
    // en el segundo parámetro se pasa la función que se ejecuta cuando se activa el evento.
    e.preventDefault();            // preventDefault es un método del objeto Event que se usa para evitar el comportamiento por defecto de un evento, en este caso evitar que el formulario se envíe y recargue la página.
                                                        
    // Capturamos los valores de los campos del formulario
    let nombre = document.getElementById("nombre").value.trim();          // value es una propiedad de algunos elementos HTML que contiene lo que el usuario escribió en el campo de texto o el valor que tenga el input por defecto.
    let email = document.getElementById("email").value.trim();         // trim() es un método del objeto String que elimina los espacios en blanco al inicio y al final de un string( los espacios en blanco son considerados como strings para JavaScript por eso usamos trim()).
    let telefono = document.getElementById("telefono").value.trim();
    let mensaje = document.getElementById("mensaje").value.trim();    // Number() es una función que sirve para convertir un valor a un número.
    
    // Limpiamos mensajes de error cuando se vuelve a enviar el formulario
    document.getElementById("errorNombre").textContent = "";         // textContent es una propiedad de los elementos HTML que permite leer o cambiar el texto dentro de un elemento.
    document.getElementById("errorEmail").textContent = "";
    document.getElementById("errorTelefono").textContent = "";
    document.getElementById("errorMensaje").textContent = "";
    
    // Limpiamos clases de valores inválidos
    document.getElementById("nombre").classList.remove("invalid-value");
    document.getElementById("email").classList.remove("invalid-value");
    document.getElementById("telefono").classList.remove("invalid-value");
    document.getElementById("mensaje").classList.remove("invalid-value");
    
    let valido = true;
    
    // Validación nombre
    if (nombre === "") {
        document.getElementById("errorNombre").textContent = "El nombre es obligatorio";
        document.getElementById("nombre").classList.remove("invalid-value");
        valido = false;
    }
    else if (nombre.length < 2 || nombre.length > 50) {
        document.getElementById("errorNombre").textContent = "El nombre debe tener entre 2 y 50 caracteres";
        document.getElementById("nombre").classList.add("invalid-value");
        valido = false;
    }
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        document.getElementById("errorNombre").textContent = "El nombre solo puede contener letras y espacios";
        document.getElementById("nombre").classList.add("invalid-value");
        valido = false;
    }
    else {
        document.getElementById("nombre").classList.remove("invalid-value");
    }
    
    // Validación email
    if (email === "") {
        document.getElementById("errorEmail").textContent = "El email es obligatorio";
        document.getElementById("email").classList.remove("invalid-value");
        valido = false;
    }
    
    // Formato general incorrecto
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("errorEmail").textContent = "El formato del email no es válido";
        document.getElementById("email").classList.add("invalid-value");
        valido = false;
    }
    else {
        document.getElementById("email").classList.remove("invalid-value");
    }
    
    // Validación teléfono (opcional pero si se llena debe ser válido)
    if (telefono !== "") {
        // Eliminar espacios, guiones y paréntesis para validar
        let telefonoLimpio = telefono.replace(/[\s\-\(\)]/g, '');
        
        if (!/^[0-9]{8,15}$/.test(telefonoLimpio)) {
            document.getElementById("errorTelefono").textContent = "El teléfono debe contener entre 8 y 15 dígitos";
            document.getElementById("telefono").classList.add("invalid-value");
            valido = false;
        }
        else {
            document.getElementById("telefono").classList.remove("invalid-value");
        }
    }
    else {
        document.getElementById("telefono").classList.remove("invalid-value");
    }
    
    // Validación mensaje
    if (mensaje === "") {
        document.getElementById("errorMensaje").textContent = "El mensaje es obligatorio";
        document.getElementById("mensaje").classList.remove("invalid-value");
        valido = false;
    }
    else if (mensaje.length < 10 || mensaje.length > 500) {
        document.getElementById("errorMensaje").textContent = "El mensaje debe tener entre 10 y 500 caracteres";
        document.getElementById("mensaje").classList.add("invalid-value");
        valido = false;
    }
    else {
        document.getElementById("mensaje").classList.remove("invalid-value");
    }

    // Si todo está bien
    if (valido) {
        // Mostrar Toast de éxito en lugar de alert
        mostrarToast(`✓ Formulario enviado correctamente.`);
        
        // Limpiar formulario usando la constante
        formulario.reset(); // reset() es un método del objeto HTMLFormElement, es decir, pertenece a los formularios HTML, y su función es devolver todos los campos del formulario a su valor inicial.
        
        // Limpiar clases de validación después del reset
        setTimeout(() => {
            document.getElementById("nombre").classList.remove("invalid-value");
            document.getElementById("email").classList.remove("invalid-value");
            document.getElementById("telefono").classList.remove("invalid-value");
            document.getElementById("mensaje").classList.remove("invalid-value");
        }, 100);
    }
});