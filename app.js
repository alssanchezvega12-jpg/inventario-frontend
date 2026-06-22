const API_URL = "https://inventario-backend-4sl0.onrender.com/productos";

// Función para consultar los datos guardados en MongoDB Atlas
async function obtenerProductos() {
  try {
    const res = await fetch(API_URL);
    const datos = await res.json();
    const tabla = document.getElementById("tabla");
    tabla.innerHTML = "";

    datos.forEach(prod => {
      tabla.innerHTML += `
        <tr>
          <td>${prod.nombre}</td>
          <td>$${prod.precio}</td>
          <td>${prod.existencia} pzas</td>
          <td>
            <button onclick="editarProducto('${prod._id}')">✏️ Editar</button>
            <button onclick="eliminarProducto('${prod._id}')">🗑️ Eliminar</button>
          </td>
        </tr>`;
    });
  } catch (err) {
    console.error("Error al traer datos:", err);
  }
}

// Función para enviar un nuevo registro
document.getElementById("formProducto").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevoObj = {
    nombre: document.getElementById("nombre").value,
    precio: Number(document.getElementById("precio").value),
    existencia: Number(document.getElementById("existencia").value)
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoObj)
    });

    if(res.ok) {
      alert("¡Guardado con éxito en MongoDB Atlas!");
      document.getElementById("formProducto").reset();
      obtenerProductos(); // Recarga la tabla
    }
  } catch (err) {
    console.error("Error al enviar datos:", err);
  }
});

// Función para eliminar producto
async function eliminarProducto(id) {
  if (!confirm("¿Seguro que quieres eliminar este producto?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Producto eliminado ✅");
      obtenerProductos();
    } else {
      alert("Error al eliminar ❌");
    }
  } catch (err) {
    console.error("Error al eliminar:", err);
  }
}

// Función para editar producto
async function editarProducto(id) {
  const nombre = prompt("Nuevo nombre:");
  const precio = prompt("Nuevo precio:");
  const existencia = prompt("Nueva cantidad:");

  if (!nombre || !precio || !existencia) {
    alert("Todos los campos son obligatorios ❌");
    return;
  }

  const actualizado = { nombre, precio: Number(precio), existencia: Number(existencia) };

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actualizado)
    });

    if (res.ok) {
      alert("Producto actualizado ✏️✅");
      obtenerProductos();
    } else {
      alert("Error al actualizar ❌");
    }
  } catch (err) {
    console.error("Error al actualizar:", err);
  }
}

// Inicializar
obtenerProductos();
