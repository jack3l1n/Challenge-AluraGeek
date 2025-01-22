// URL del servidor JSON
const API_URL = 'http://localhost:3000/productos';

// Referencias a elementos HTML
const listaProductos = document.getElementById('lista-productos');
const mensajeVacio = document.getElementById('mensaje-vacio');

// Función para manejar el envío del formulario
function procesarFormulario(event) {
    event.preventDefault(); // Evita que la página se recargue al enviar el formulario

    // Captura los valores de los campos del formulario
    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value).toFixed(2);
    const imagen = document.getElementById('imagen').value;

    // Llama a la función para agregar el producto
    agregarProducto(nombre, precio, imagen);

    // Limpia el formulario después de enviar
    event.target.reset();
}

// Función para cargar productos desde la API
async function cargarProductos() {
    try {
        const respuesta = await fetch(API_URL); // Solicitud GET
        const productos = await respuesta.json();

                // Verifica los productos recibidos
                console.log("Productos recibidos:", productos);

        // Limpiar la lista actual
        listaProductos.innerHTML = '';

        if (productos.length > 0) {
            // Ocultar mensaje vacío
            mensajeVacio.style.display = 'none';

            // Mostrar productos
            productos.forEach(producto => {
                const tarjetaProducto = document.createElement('div');
                tarjetaProducto.classList.add('tarjeta-producto');
            
                const precioFormateado = parseFloat(producto.precio).toFixed(2);
            
                tarjetaProducto.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-producto">
                    <h4 class="nombre-producto">${producto.nombre}</h4>
                    <p class="precio-producto">$${precioFormateado}</p>
                `;
            
                // Crear botón de eliminar y agregar evento
                const botonEliminar = document.createElement('button');
                botonEliminar.classList.add('boton-eliminar');
                botonEliminar.innerHTML = `<img src="/Multimedia/🦆 icon _trash 2_.png" alt="Eliminar">`;
                botonEliminar.addEventListener('click', () => eliminarProducto(producto.id));
            
                tarjetaProducto.appendChild(botonEliminar);
                listaProductos.appendChild(tarjetaProducto);
            });
            
            
        } else {
            // Mostrar mensaje vacío
            mensajeVacio.style.display = 'block';
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Función para agregar un producto (POST a la API)
async function agregarProducto(nombre, precio, imagen) {
    try {
        const nuevoProducto = { nombre, precio, imagen };
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoProducto),
        });

        if (respuesta.ok) {
            cargarProductos(); // Recargar lista de productos
        } else {
            console.error('Error al agregar producto:', respuesta.statusText);
        }
    } catch (error) {
        console.error('Error al agregar producto:', error);
    }
}

// Función para eliminar un producto (DELETE a la API)
async function eliminarProducto(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (respuesta.ok) {
            console.log(`Producto con id ${id} eliminado`);
            cargarProductos(); // Recargar lista de productos
        } else {
            console.error('Error al eliminar producto:', respuesta.statusText);
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
    }
}

// Cargar productos al iniciar
cargarProductos();
