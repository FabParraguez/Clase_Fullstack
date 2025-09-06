// ===============================
// INCLUDES DE NAVBAR Y FOOTER
// ===============================
// Estas funciones permiten incluir automáticamente el navbar y el footer desde archivos externos (navbar.html y footer.html)
function includeHTML(selector, url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar ' + url + ': ' + response.status);
            }
            return response.text();
        })
        .then(data => {
            document.querySelector(selector).innerHTML = data;
            console.log('Incluido correctamente:', url);
        })
        .catch(err => {
            const el = document.querySelector(selector);
            if (el) {
                el.innerHTML = '<div style="color:red; background:#fff; padding:8px; border:1px solid red;">Error al incluir ' + url + ': ' + err.message + '</div>';
            }
            console.error('Error al incluir', url, err);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    if(document.querySelector('#navbar-include')) {
        includeHTML('#navbar-include', 'navbar.html');
    }
    if(document.querySelector('#footer-include')) {
        includeHTML('#footer-include', 'footer.html');
    }
});
/*Creación de métodos en JavaScript */
function Saludo() {
            alert('¡Hola! Bienvenido a Nube Comics.');
        }

function cargarCarrito() {

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let cantidades = JSON.parse(localStorage.getItem('cantidades')) || carrito.map(() => 1);

    const contenedor = document.getElementById('carrito-lista');
    const resumenTotal = document.getElementById('resumen-total');
    const cantidad = document.getElementById('carrito-cantidad');
    contenedor.innerHTML = "";
    let total = 0;
    let totalSinDescuento = 0;

    cantidad.textContent = carrito.length;

    if (carrito.length === 0) {
        contenedor.innerHTML = '<div class="card mb-3 rounded-4 overflow-hidden"><div class="card-body text-center">No hay productos en el carrito.</div></div>';
        resumenTotal.textContent = "CLP 0";
        localStorage.removeItem('cantidades');
        return;
    }

    // Calcular total sin descuento para mostrar en cards
    carrito.forEach((producto, idx) => {
        let precioNum = parseInt(producto.precio.replace(/[^\d]/g, ''));
        let cantidadProd = cantidades[idx] || 1;
        totalSinDescuento += precioNum * cantidadProd;
    });

    // Si el total supera 20.000, aplicar descuento del 30%
    let descuento = 0;
    let totalConDescuento = totalSinDescuento;
    if (totalSinDescuento > 20000) {
        descuento = Math.round(totalSinDescuento * 0.3);
        totalConDescuento = totalSinDescuento - descuento;
    }

    // Renderizar productos en el carrito
    carrito.forEach((producto, idx) => {
        let precioNum = parseInt(producto.precio.replace(/[^\d]/g, ''));
        let cantidadProd = cantidades[idx] || 1;
        let subtotal = precioNum * cantidadProd;
        let subtotalConDescuento = subtotal;
        let mostrarDescuento = false;
        if (totalSinDescuento > 20000) {
            subtotalConDescuento = Math.round(subtotal * 0.7);
            mostrarDescuento = true;
        }
        const card = document.createElement('div');
        card.className = "card mb-3 rounded-4 overflow-hidden";
        card.innerHTML = `
            <div class="row g-0 align-items-center">
                <div class="col-md-2 text-center">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid p-2">
                </div>
                <div class="col-md-6">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text text-muted">${producto.descripcion || ''}</p>
                        <p class="card-text">
                            ${mostrarDescuento
                                ? `<span class='text-decoration-line-through text-secondary'>${producto.precio}</span> <span class='fw-bold text-danger ms-2'>CLP ${subtotalConDescuento.toLocaleString()}</span>`
                                : `<span class='text-primary fw-bold'>${producto.precio}</span>`}
                        </p>
                    </div>
                </div>
                <div class="col-md-4 d-flex flex-column align-items-center justify-content-center">
                    <input type="number" min="1" value="${cantidadProd}" class="form-control w-50 mb-2 text-center cantidad-input" data-idx="${idx}">
                    <button class="btn btn-outline-danger btn-sm eliminar-producto" data-idx="${idx}">Eliminar</button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });

    // Mostrar el total en el resumen
    if (totalSinDescuento > 20000) {
        resumenTotal.innerHTML = `<span class='text-decoration-line-through text-secondary'>CLP ${totalSinDescuento.toLocaleString()}</span> <span class='fw-bold text-danger ms-2'>CLP ${totalConDescuento.toLocaleString()}</span><br><span class='text-success small'>¡Descuento 30% aplicado!</span>`;
    } else {
        resumenTotal.textContent = "CLP " + totalSinDescuento.toLocaleString();
    }

    document.querySelectorAll('.eliminar-producto').forEach(btn => {
        btn.addEventListener('click', function() {
            let idx = this.getAttribute('data-idx');
            carrito.splice(idx, 1);
            cantidades.splice(idx, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            localStorage.setItem('cantidades', JSON.stringify(cantidades));
            cargarCarrito();
        });
    });

    document.querySelectorAll('.cantidad-input').forEach(input => {
        input.addEventListener('change', function() {
            let idx = this.getAttribute('data-idx');
            let val = parseInt(this.value);
            if (isNaN(val) || val < 1) val = 1;
            cantidades[idx] = val;
            localStorage.setItem('cantidades', JSON.stringify(cantidades));
            cargarCarrito();
        });
    });

    localStorage.setItem('cantidades', JSON.stringify(cantidades));
}

function mostrarDetalleProducto() {
    const producto = JSON.parse(localStorage.getItem('productoDetalle'));
    if (producto) {
        document.getElementById('detalle-imagen').src = producto.imagen;
        document.getElementById('detalle-imagen').alt = producto.nombre;
        document.getElementById('detalle-nombre').textContent = producto.nombre;
        document.getElementById('detalle-descripcion').textContent = producto.descripcion;
        document.getElementById('detalle-precio').textContent = producto.precio;
    } else {
        document.querySelector('.card-body').innerHTML = '<p>No se encontró información del producto.</p>';
    }
}

function agregarAlCarrito() {
    const producto = JSON.parse(localStorage.getItem('productoDetalle'));
    if (producto) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.push(producto);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        alert('¡Producto agregado al carrito!');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('carrito-lista')) {
        cargarCarrito();
    }
    if (document.getElementById('detalle-imagen')) {
        mostrarDetalleProducto();
    }

    // Para detalle.html: agregar al carrito desde el detalle
    const btnAgregarDetalle = document.getElementById('btn-agregar-detalle');
    if (btnAgregarDetalle) {
        btnAgregarDetalle.addEventListener('click', function() {
            const producto = JSON.parse(localStorage.getItem('productoDetalle'));
            if (producto) {
                agregarAlCarrito(producto); // Usa la función global
            }
        });
    }

    const btnVolver = document.getElementById('btn-volver');
    if (btnVolver) {
        btnVolver.addEventListener('click', function() {
            const rutaAnterior = localStorage.getItem('rutaAnterior');
            if (rutaAnterior) {
                window.location.href = rutaAnterior;
            } else {
                window.location.href = 'inicio.html'; // o la ruta por defecto
            }
        });
    }
});

// Obtener el parámetro de la editorial desde la URL (?editorial=ivreaarg)
    function getEditorialFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('editorial');
    }

    function mostrarProductos(editorial) {
        const productos = productosPorEditorial[editorial] || [];
        const nombreEditorial = nombresEditoriales[editorial] || "Editorial";
        document.getElementById('titulo-editorial').textContent = nombreEditorial;

        // Cambiar banner según editorial
        const bannerImg = document.getElementById('banner-editorial');
        if (bannerImg) {
            bannerImg.src = bannersEditoriales[editorial] || "img/Banner editorial/default.jpg";
        }

        const contenedor = document.getElementById('productos-lista');
        contenedor.innerHTML = "";

        if (productos.length === 0) {
            contenedor.innerHTML = '<div class="col-12"><p class="text-center">No hay productos para esta editorial.</p></div>';
            return;
        }

        productos.forEach((producto, idx) => {
            const card = document.createElement('div');
            card.className = "col-md-4 mb-4";
            card.innerHTML = `
                <div class="card overflow-hidden h-100">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">${producto.descripcion}</p>
                        <span class="fw-bold text-primary">${producto.precio}</span>
                        <br>
                        <button class="btn btn-primary mt-2 detalle" data-editorial="${editorial}" data-idx="${idx}">Detalle</button>
                        <br>
                        <button class="btn btn-info mt-2 agregar-carrito" data-editorial="${editorial}" data-idx="${idx}">Agregar al carrito</button>
                    </div>
                </div>
            `;
            contenedor.appendChild(card);
        });

        // Agregar evento a los botones
        document.querySelectorAll('.agregar-carrito').forEach(btn => {
            btn.addEventListener('click', function() {
                const editorial = this.getAttribute('data-editorial');
                const idx = this.getAttribute('data-idx');
                const producto = productosPorEditorial[editorial][idx];
                agregarAlCarrito(producto);
            });
        });
        // Evento para el botón Detalle
        document.querySelectorAll('.detalle').forEach(btn => {
            btn.addEventListener('click', function() {
                const editorial = this.getAttribute('data-editorial');
                const idx = this.getAttribute('data-idx');
                const producto = productosPorEditorial[editorial][idx];
                // Guardar la ruta anterior
localStorage.setItem('rutaAnterior', window.location.pathname + window.location.search);
                localStorage.setItem('productoDetalle', JSON.stringify(producto));
                window.location.href = 'detalle.html';
            });
        });
    }

    // Función para agregar producto a localStorage
    function agregarAlCarrito(producto) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        let cantidades = JSON.parse(localStorage.getItem('cantidades')) || [];

        // Buscar si el producto ya está en el carrito (por nombre, puedes usar otro identificador único si tienes)
        let idx = carrito.findIndex(p => p.nombre === producto.nombre);

        if (idx !== -1) {
            // Ya existe, aumenta la cantidad
            cantidades[idx] = (cantidades[idx] || 1) + 1;
        } else {
            // No existe, lo agrega y pone cantidad 1
            carrito.push(producto);
            cantidades.push(1);
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
        localStorage.setItem('cantidades', JSON.stringify(cantidades));

    }

    // Al cargar la página
    document.addEventListener('DOMContentLoaded', function() {
        const editorial = getEditorialFromURL();
        mostrarProductos(editorial);
    });

function mostrarSidebarCarrito() {

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let cantidades = JSON.parse(localStorage.getItem('cantidades')) || [];
    const sidebar = document.getElementById('carrito-sidebar');
    const btnMax = document.getElementById('maximizar-carrito');
    const body = document.getElementById('carrito-sidebar-body');
    if (!sidebar || !body) return;

    if (carrito.length === 0) {
        sidebar.style.display = "none";
        if (btnMax) btnMax.style.display = "none";
        return;
    } else {
        sidebar.style.display = "";
        if (sidebar.classList.contains('minimizado')) {
            if (btnMax) btnMax.style.display = '';
        } else {
            if (btnMax) btnMax.style.display = 'none';
        }
    }

    // Calcular total para saber si hay descuento
    let totalSinDescuento = 0;
    carrito.forEach((prod, idx) => {
        let precioNum = parseInt(prod.precio.replace(/[^\d]/g, ''));
        let cantidadProd = cantidades[idx] || 1;
        totalSinDescuento += precioNum * cantidadProd;
    });
    let aplicarDescuento = totalSinDescuento > 20000;

    body.innerHTML = '';
    carrito.forEach((prod, idx) => {
        let precioNum = parseInt(prod.precio.replace(/[^\d]/g, ''));
        let cantidadProd = cantidades[idx] || 1;
        let subtotal = precioNum * cantidadProd;
        let subtotalConDescuento = subtotal;
        if (aplicarDescuento) {
            subtotalConDescuento = Math.round(subtotal * 0.7);
        }
        body.innerHTML += `
            <div class="d-flex align-items-center border-bottom py-2">
                <img src="${prod.imagen}" alt="${prod.nombre}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;">
                <div class="ms-2 flex-grow-1">
                    <div style="font-size:14px;">${prod.nombre}</div>
                    <div style="font-size:13px;">
                        x${cantidadProd} -
                        ${aplicarDescuento
                            ? `<span class='text-decoration-line-through text-secondary'>${prod.precio}</span> <span class='fw-bold text-danger ms-1'>CLP ${subtotalConDescuento.toLocaleString()}</span>`
                            : `<span class='text-muted'>${prod.precio}</span>`}
                    </div>
                </div>
                <button class="btn btn-link text-danger p-0 ms-2 eliminar-sidebar" data-idx="${idx}" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
    });

    // Asigna eventos a los botones de eliminar
    document.querySelectorAll('.eliminar-sidebar').forEach(btn => {
        btn.addEventListener('click', function() {
            carrito.splice(this.getAttribute('data-idx'), 1);
            cantidades.splice(this.getAttribute('data-idx'), 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            localStorage.setItem('cantidades', JSON.stringify(cantidades));
            mostrarSidebarCarrito();
        });
    });
}

function abrirSidebarCarrito() {
    document.getElementById('carrito-sidebar').classList.remove('minimizado');
    document.getElementById('maximizar-carrito').style.display = 'none';
    mostrarSidebarCarrito();
}

function minimizarSidebarCarrito() {
    document.getElementById('carrito-sidebar').classList.add('minimizado');
    document.getElementById('maximizar-carrito').style.display = '';
}

document.addEventListener('DOMContentLoaded', function() {
    // Minimizar/maximizar sidebar
    const btnMin = document.getElementById('minimizar-carrito');
    const btnMax = document.getElementById('maximizar-carrito');
    if (btnMin && btnMax) {
        btnMin.onclick = minimizarSidebarCarrito;
        btnMax.onclick = abrirSidebarCarrito;
    }
    // Botón ir al carrito
    const btnIrCarrito = document.getElementById('ir-carrito');
    if (btnIrCarrito) {
        btnIrCarrito.onclick = function() {
            window.location.href = 'comprar.html';
        };
    }
    // Mostrar el sidebar si hay productos
    mostrarSidebarCarrito();

    // Ya se declaró btnMax arriba, así que solo usamos el existente
    if (btnMax) {
        btnMax.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita que el click se propague y minimice
            abrirSidebarCarrito();
        });
    }

    // Minimizar al hacer clic fuera del sidebar
    document.addEventListener('mousedown', function(event) {
        const sidebar = document.getElementById('carrito-sidebar');
        const btnMax = document.getElementById('maximizar-carrito');
        if (
            sidebar &&
            !sidebar.classList.contains('minimizado') &&
            !sidebar.contains(event.target) &&
            (!btnMax || event.target !== btnMax)
        ) {
            sidebar.classList.add('minimizado');
            if (btnMax) btnMax.style.display = '';
        }
    });
});

// Modifica la función agregarAlCarrito para mostrar el sidebar al agregar
function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let cantidades = JSON.parse(localStorage.getItem('cantidades')) || [];
    let idx = carrito.findIndex(p => p.nombre === producto.nombre);
    if (idx !== -1) {
        cantidades[idx] = (cantidades[idx] || 1) + 1;
    } else {
        carrito.push(producto);
        cantidades.push(1);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('cantidades', JSON.stringify(cantidades));
    window.requestAnimationFrame(function() {
      // Actualiza sidebar
      if (typeof mostrarSidebarCarrito === 'function') mostrarSidebarCarrito();
      if (typeof abrirSidebarCarrito === 'function') abrirSidebarCarrito();
      // Actualiza lista principal si existe (comprar.html)
      if (typeof cargarCarrito === 'function') cargarCarrito();
      // Actualiza contador en nav si existe
      var cant = document.getElementById('carrito-cantidad');
      if (cant) cant.textContent = carrito.length;
    });
}

// ===============================
// Funciones para almacen.html
// ===============================

// Función para ver detalles del producto (usada en almacen)
function verDetalle(nombre, descripcion, precio, imagen, editorial) {
    const producto = { nombre, descripcion, precio, imagen };
    localStorage.setItem('productoDetalle', JSON.stringify(producto));
    localStorage.setItem('editorialDetalle', editorial); // Esto es clave
    window.location.href = 'detalle.html';
}

// Función para cargar productos de una editorial
function cargarProductos(editorial) {
    const productos = productosPorEditorial[editorial] || [];
    const nombreEditorial = nombresEditoriales[editorial] || "Editorial";
    document.getElementById('titulo-editorial').innerText = nombreEditorial;

    // Cambiar banner según editorial
    const bannerImg = document.getElementById('banner-editorial');
    if (bannerImg) {
        bannerImg.src = bannersEditoriales[editorial] || "img/Banner editorial/default.jpg";
    }

    const contenedor = document.getElementById('productos-lista');
    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = '<div class="col-12"><p class="text-center">No hay productos para esta editorial.</p></div>';
        return;
    }

    productos.forEach((producto, idx) => {
        const card = document.createElement('div');
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
            <div class="card overflow-hidden h-100">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body text-center">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <span class="fw-bold text-primary">${producto.precio}</span>
                    <br>
                    <button class="btn btn-primary mt-2 detalle" data-editorial="${editorial}" data-idx="${idx}">Detalle</button>
                    <br>
                    <button class="btn btn-info mt-2 agregar-carrito" data-editorial="${editorial}" data-idx="${idx}">Agregar al carrito</button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });

    // Agregar evento a los botones
    document.querySelectorAll('.agregar-carrito').forEach(btn => {
        btn.addEventListener('click', function() {
            const editorial = this.getAttribute('data-editorial');
            const idx = this.getAttribute('data-idx');
            const producto = productosPorEditorial[editorial][idx];
            agregarAlCarrito(producto);
        });
    });
    // Evento para el botón Detalle
    document.querySelectorAll('.detalle').forEach(btn => {
        btn.addEventListener('click', function() {
            const editorial = this.getAttribute('data-editorial');
            const idx = this.getAttribute('data-idx');
            const producto = productosPorEditorial[editorial][idx];
            // Guardar la ruta anterior
localStorage.setItem('rutaAnterior', window.location.pathname + window.location.search);
            localStorage.setItem('productoDetalle', JSON.stringify(producto));
            window.location.href = 'detalle.html';
        });
    });
}

// Cambiar productos al seleccionar una editorial desde el menú
function inicializarDropdownEditoriales() {
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', event => {
            // Normaliza el texto para el id de la editorial
            const editorialSeleccionada = event.target.innerText.toLowerCase().replace(/ /g, '');
            cargarProductos(editorialSeleccionada);
            document.getElementById("titulo-editorial").innerText = nombresEditoriales[editorialSeleccionada];
            document.getElementById("banner-editorial").src = bannersEditoriales[editorialSeleccionada];
        });
    });
}

// ===============================
// FIN Funciones para almacen.html
// ===============================

// Al cargar la página almacen.html, mostrar productos de la editorial seleccionada en la URL o la primera por defecto
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('productos-lista')) {
        let editorial = getEditorialFromURL();
        if (!editorial) {
            editorial = Object.keys(productosPorEditorial)[0];
        }
        cargarProductos(editorial);
        inicializarDropdownEditoriales();
    }
});

// Une todos los productos de todas las editoriales en un solo array
function obtenerTodosLosProductos(editorial = "todas") {
    let todos = [];
    if (editorial === "todas") {
        for (const key in productosPorEditorial) {
            todos = todos.concat(productosPorEditorial[key]);
        }
    } else if (productosPorEditorial[editorial]) {
        todos = productosPorEditorial[editorial];
    }
    return todos;
}

// Muestra todos los productos como cards en vitrina.html
function mostrarTodosLosProductos(editorial = "todas") {
    const productos = obtenerTodosLosProductos(editorial);
    const contenedor = document.getElementById('productos-vitrina');
    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = '<div class="col-12"><p class="text-center">No hay productos disponibles.</p></div>';
        return;
    }

    productos.forEach((producto, idx) => {
        const card = document.createElement('div');
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
            <div class="card overflow-hidden h-100">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body text-center">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <span class="fw-bold text-primary">${producto.precio}</span>
                    <br>
                    <button class="btn btn-primary mt-2 detalle" data-nombre="${producto.nombre}">Detalle</button>
                    <br>
                    <button class="btn btn-info mt-2 agregar-carrito" data-nombre="${producto.nombre}">Agregar al carrito</button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });

    // Eventos para los botones
    document.querySelectorAll('.agregar-carrito').forEach(btn => {
        btn.addEventListener('click', function() {
            const nombre = this.getAttribute('data-nombre');
            const producto = productos.find(p => p.nombre === nombre);
            if (producto) agregarAlCarrito(producto);
        });
    });
    document.querySelectorAll('.detalle').forEach(btn => {
        btn.addEventListener('click', function() {
            const nombre = this.getAttribute('data-nombre');
            const producto = productos.find(p => p.nombre === nombre);
            if (producto) {
                localStorage.setItem('productoDetalle', JSON.stringify(producto));
                window.location.href = 'detalle.html';
            }
        });
    });
}

// Evento para el filtro

// --- Lógica de filtrado por precio y editorial para vitrina.html ---
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('productos-vitrina')) {

        // Formatea un número solo con separador de miles (sin CLP)
        function formatearSoloNumero(valor) {
            if (isNaN(valor) || valor === null) return '';
            return Number(valor).toLocaleString('es-CL');
        }

        // Formatea el input al salir del campo o al escribir (sin CLP)
        function formatearInputPrecio(input) {
            let val = input.value.replace(/[^\d]/g, '');
            if (val) {
                input.value = formatearSoloNumero(val);
            } else {
                input.value = '';
            }
        }

        // Quita el formato CLP para obtener el valor numérico
        function obtenerValorNumericoInput(input) {
            return parseInt(input.value.replace(/[^\d]/g, '')) || 0;
        }

        // Asignar eventos a los inputs de precio
        const inputMin = document.getElementById('precio-min');
        const inputMax = document.getElementById('precio-max');
        if (inputMin && inputMax) {
            // Al salir del campo, formatea
            inputMin.addEventListener('blur', function() { formatearInputPrecio(inputMin); });
            inputMax.addEventListener('blur', function() { formatearInputPrecio(inputMax); });
            // Al escribir, si es número, formatea en tiempo real
            inputMin.addEventListener('input', function() {
                let val = inputMin.value.replace(/[^\d]/g, '');
                if (val.length > 1 && val[0] === '0') val = val.replace(/^0+/, '');
                if (val) inputMin.value = formatearSoloNumero(val);
                else inputMin.value = '';
            });
            inputMax.addEventListener('input', function() {
                let val = inputMax.value.replace(/[^\d]/g, '');
                if (val.length > 1 && val[0] === '0') val = val.replace(/^0+/, '');
                if (val) inputMax.value = formatearSoloNumero(val);
                else inputMax.value = '';
            });
        }
        // Función para obtener el valor numérico del precio (ej: "CLP 8.990" -> 8990)
        function extraerPrecioNumerico(precioStr) {
            if (!precioStr) return 0;
            // Quita todo excepto dígitos
            return parseInt(precioStr.replace(/[^\d]/g, ''), 10) || 0;
        }

        // Función para mostrar productos filtrados por editorial y precio
        function mostrarProductosFiltrados() {
            const editorial = document.getElementById('filtro-editorial').value;
            const min = obtenerValorNumericoInput(document.getElementById('precio-min'));
            const max = obtenerValorNumericoInput(document.getElementById('precio-max')) || Infinity;
            let productos = obtenerTodosLosProductos(editorial);
            productos = productos.filter(p => {
                const precio = extraerPrecioNumerico(p.precio);
                return precio >= min && precio <= max;
            });
            // Renderizado igual que mostrarTodosLosProductos
            const contenedor = document.getElementById('productos-vitrina');
            contenedor.innerHTML = "";
            if (productos.length === 0) {
                contenedor.innerHTML = '<div class="col-12"><p class="text-center">No hay productos disponibles.</p></div>';
                return;
            }
            productos.forEach((producto, idx) => {
                const card = document.createElement('div');
                card.className = "col-md-4 mb-4 d-flex align-items-stretch";
                card.innerHTML = `
                    <div class="card h-100 d-flex flex-column">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                        <div class="card-body d-flex flex-column justify-content-between text-center p-2">
                            <div>
                                <h5 class="card-title">${producto.nombre}</h5>
                                <span class="fw-bold text-primary">${producto.precio}</span>
                            </div>
                            <div class="mt-auto d-flex flex-column gap-2">
                                <button class="btn btn-primary detalle" data-nombre="${producto.nombre}">Detalle</button>
                                <button class="btn btn-info agregar-carrito" data-nombre="${producto.nombre}">Agregar al carrito</button>
                            </div>
                        </div>
                    </div>
                `;
                contenedor.appendChild(card);
            });
            // Eventos para los botones
            document.querySelectorAll('.agregar-carrito').forEach(btn => {
                btn.addEventListener('click', function() {
                    const nombre = this.getAttribute('data-nombre');
                    const producto = productos.find(p => p.nombre === nombre);
                    if (producto) agregarAlCarrito(producto);
                });
            });
            document.querySelectorAll('.detalle').forEach(btn => {
                btn.addEventListener('click', function() {
                    const nombre = this.getAttribute('data-nombre');
                    const producto = productos.find(p => p.nombre === nombre);
                    if (producto) {
                        localStorage.setItem('productoDetalle', JSON.stringify(producto));
                        // Guardar la ruta anterior para volver
                        localStorage.setItem('rutaAnterior', window.location.pathname + window.location.search);
                        window.location.href = 'detalle.html';
                    }
                });
            });
        }

        // Inicializar productos al cargar
        mostrarProductosFiltrados();

        // Filtro por editorial
        const filtroEditorial = document.getElementById('filtro-editorial');
        if (filtroEditorial) {
            filtroEditorial.addEventListener('change', mostrarProductosFiltrados);
        }

        // Filtro por precio (botón)
        const btnFiltrarPrecio = document.getElementById('btn-filtrar-precio');
        if (btnFiltrarPrecio) {
            btnFiltrarPrecio.addEventListener('click', mostrarProductosFiltrados);
        }
    }
});

