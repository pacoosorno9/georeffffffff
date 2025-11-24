// CENTRAR MAPA EN UN LUGAR REAL (León, GTO)
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

// Manejo del formulario
document.getElementById('place-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const lat = document.getElementById('lat').value;
    const lng = document.getElementById('lng').value;

    const response = await fetch('http://localhost:3000/api/places', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, lat, lng })
    });

    const data = await response.json();
    alert(data.message);
    location.reload();
});

// Cargar lugares guardados desde el backend
async function loadPlaces() {
    const res = await fetch('http://localhost:3000/api/places');
    const places = await res.json();

    places.forEach(place => {
        const [lng, lat] = place.location.coordinates;

        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<strong>${place.name}</strong><br>${place.description}`);
    });
}

loadPlaces();