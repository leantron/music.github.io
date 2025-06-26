"use strict"

document.addEventListener('DOMContentLoaded', () => {
    let btnToggle = document.querySelector('#btn-open');
    btnToggle.addEventListener('click', toggleMenu);

    function toggleMenu() { 
        let menu = document.querySelector('#menu');
        menu.classList.toggle('open');
    }

    document.getElementById('btn-oscuro').addEventListener('click', function() {
        document.body.classList.toggle('modo-oscuro')
    });


    /*API*/
    const API_URL = 'https://685b411589952852c2d8fd7b.mockapi.io/api/v1/Carrito';

const discos = [
  { titulo: 'Dance Devil Dance', artista: 'Avatar', precio: 15000 },
  { titulo: 'Babymetal Death', artista: 'Babymetal', precio: 17000 },
  { titulo: 'Where The Exit', artista: 'Blind', precio: 19500 },
  { titulo: 'Kaisarion', artista: 'Ghost', precio: 25000 },
  { titulo: 'Blood & Glitter', artista: 'Lord of the Lost', precio: 18000 },
  { titulo: 'Too Far Gone?', artista: 'Metallica', precio: 31500 },
  { titulo: 'Too Close/Too late', artista: 'Spiritbox', precio: 21000 },
  { titulo: 'Almendra', artista: 'Spinetta', precio: 54000 },
  { titulo: 'Amor Amarillo', artista: 'Cerati', precio: 23000 },
  { titulo: 'Artaud', artista: 'Spinetta', precio: 19000 },
  { titulo: 'Bocanada', artista: 'Cerati', precio: 32000 },
  { titulo: 'Doble vida', artista: 'Soda Stereo', precio: 27000 },
  { titulo: 'Mayhem', artista: 'Lady Gaga ', precio: 35500 },
  { titulo: 'Minutes to Midnight', artista: 'Linkin Park', precio: 45500 },
  { titulo: 'Nevermind', artista: 'Nirvana', precio: 38000 },
  { titulo: 'Heathens', artista: 'twenty one pilots', precio: 42000 },
  { titulo: 'Double Fantasy', artista: 'John Lennon', precio: 40000 },
  { titulo: 'Out of Our Heads', artista: 'The Rolling Stones', precio: 30500 },
  { titulo: 'Number One', artista: 'My Chemical Romance', precio: 31250 },
  { titulo: 'Absolute Greatest', artista: 'Queen', precio: 22800 },
  { titulo: 'Adore You', artista: 'Harry Styles', precio: 24500 },
  { titulo: 'Reckless', artista: 'Bryan Adams', precio: 27999 }
];

const formCompra = document.getElementById('formCompra');
const selectDisco = document.getElementById('disco');
const inputCantidad = document.getElementById('cantidad');
const inputArtista = document.getElementById('artista');
const inputPrecio = document.getElementById('precio');
const tablaBody = document.getElementById('tablaCarrito');
const totalCell = document.getElementById('total');

discos.forEach(disco => {
  const option = document.createElement('option');
  option.value = JSON.stringify(disco);
  option.textContent = `${disco.titulo} - ${disco.artista} ($${disco.precio})`;
  selectDisco.appendChild(option);
});

selectDisco.addEventListener('change', () => {
  if (selectDisco.value) {
    const disco = JSON.parse(selectDisco.value);
    inputArtista.value = disco.artista;
    inputPrecio.value = disco.precio;
  } else {
    inputArtista.value = '';
    inputPrecio.value = '';
  }
});

async function cargarCarrito() {
  tablaBody.innerHTML = '';
  const res = await fetch(API_URL);
  const items = await res.json();
  let total = 0;

  items.forEach(item => {
    total += item.precio * item.cantidad;

    const tr = document.createElement('tr');

    const tdTitulo = document.createElement('td');
    tdTitulo.textContent = item.titulo;

    const tdArtista = document.createElement('td');
    tdArtista.textContent = item.artista;

    const tdPrecio = document.createElement('td');
    tdPrecio.textContent = item.precio;

    const tdCantidad = document.createElement('td');
    const inputCant = document.createElement('input');
    inputCant.type = 'number';
    inputCant.min = 1;
    inputCant.value = item.cantidad;
    inputCant.readOnly = true;
    tdCantidad.appendChild(inputCant);

    const tdAcciones = document.createElement('td');

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.onclick = () => {
      inputCant.readOnly = false;
      btnGuardar.disabled = false;
      inputCant.focus();
    };

    const btnGuardar = document.createElement('button');
    btnGuardar.textContent = 'Guardar';
    btnGuardar.disabled = true;
    btnGuardar.onclick = async () => {
      const actualizado = {
        titulo: item.titulo,
        artista: item.artista,
        precio: item.precio,
        cantidad: parseInt(inputCant.value)
      };
      await fetch(`${API_URL}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualizado)
      });
      cargarCarrito();
    };

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.onclick = async () => {
      await fetch(`${API_URL}/${item.id}`, { method: 'DELETE' });
      cargarCarrito();
    };

    tdAcciones.appendChild(btnEditar);
    tdAcciones.appendChild(btnGuardar);
    tdAcciones.appendChild(btnEliminar);

    tr.appendChild(tdTitulo);
    tr.appendChild(tdArtista);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdCantidad);
    tr.appendChild(tdAcciones);

    tablaBody.appendChild(tr);
  });

  totalCell.textContent = `Total: $${total}`;
}

formCompra.onsubmit = async (e) => {
  e.preventDefault();
  const disco = JSON.parse(selectDisco.value);
  const cantidad = parseInt(inputCantidad.value);
  const res = await fetch(API_URL);
  const items = await res.json();

  const yaExiste = items.find(i => i.titulo === disco.titulo);

  if (yaExiste) {
    const actualizado = {
      titulo: yaExiste.titulo,
      artista: yaExiste.artista,
      precio: yaExiste.precio,
      cantidad: yaExiste.cantidad + cantidad
    };
    await fetch(`${API_URL}/${yaExiste.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actualizado)
    });
  } else {
    const nuevo = {
      ...disco,
      cantidad
    };
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });
  }

  formCompra.reset();
  inputArtista.value = '';
  inputPrecio.value = '';
  cargarCarrito();
};

cargarCarrito();
});