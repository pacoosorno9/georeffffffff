// CENTRAR MAPA EN LEON 
const map = L.map('map').setView([21.129, -101.686], 13);

// Capa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Evento click para capturar coordenadas
let marker;
map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup('Ubicación seleccionada')
        .openPopup();
});

// Crear lugar
document.getElementById('place-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const lat = document.getElementById('lat').value;
    const lng = document.getElementById('lng').value;

    const response = await fetch('http://localhost:3000/api/places', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, description, lat, lng })
    });

    const data = await response.json();
    alert(data.message);
    loadPlaces();
});

// BORRAR
async function deletePlace(id) {
    if (!confirm("¿Eliminar este lugar?")) return;

    const res = await fetch(`http://localhost:3000/api/places/${id}`, {
        method: "DELETE"
    });

    const data = await res.json();
    alert(data.message);
    loadPlaces();
}

// EDITAR
async function editPlace(id) {
    const name = prompt("Nuevo nombre:");
    const description = prompt("Nueva descripción:");
    const lat = prompt("Nueva latitud:");
    const lng = prompt("Nueva longitud:");

    const res = await fetch(`http://localhost:3000/api/places/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, description, lat, lng })
    });

    const data = await res.json();
    alert(data.message);
    loadPlaces();
}

// MOSTRAR/OCULTAR TABLA
document.getElementById("toggle-table").addEventListener("click", () => {
    const table = document.getElementById("table-container");

    if (table.style.display === "none") {
        table.style.display = "block";
        document.getElementById("toggle-table").innerText = "Ocultar lugares";
    } else {
        table.style.display = "none";
        document.getElementById("toggle-table").innerText = "Mostrar todos los lugares";
    }
});

// CARGAR MARCADORES Y TABLA
async function loadPlaces() {
    const res = await fetch('http://localhost:3000/api/places');
    const places = await res.json();

    // Limpia marcadores anteriores
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    const tbody = document.querySelector("#places-table tbody");
    tbody.innerHTML = "";

    places.forEach(place => {
        const [lng, lat] = place.location.coordinates;

        // Marcador
        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`
                <strong>${place.name}</strong><br>
                ${place.description}<br><br>
                <button onclick="editPlace('${place._id}')">Editar</button>
                <button onclick="deletePlace('${place._id}')">Borrar</button>
            `);

        // Tabla
        tbody.innerHTML += `
            <tr>
                <td>${place.name}</td>
                <td>${place.description}</td>
                <td>${lat}</td>
                <td>${lng}</td>
                <td>
                    <button onclick="editPlace('${place._id}')">Editar</button>
                    <button onclick="deletePlace('${place._id}')">Borrar</button>
                </td>
            </tr>
        `;
    });
}

loadPlaces();