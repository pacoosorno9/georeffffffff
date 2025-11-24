const map = L.map('map').setView([10.67, -101.35], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

//EVENTO CLICK PARA CAPTURAR LAS COORDENADAS
let marker;
map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lng]).addTo(map) 
    .bindPopup('Ubicacion seleccionada').openPopup();
});

//manejar el formulario
//Interepreta el envio del formulario para evitar que la pagina se recargue automaticamente
document.getElementById('place-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Toma los valores del form
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const lat = document.getElementById('lat').value;
    const lng = document.getElementById('lng').value;

    const response = await fetch('/api/places', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, lat, lng })
    });

    //ESPERA LA RESPUESTA, MUESTRA UN MENSAJE Y RECARGA LA PAGINA PARA QUE EL NUEVO LUGAR APAREZCA EN EL MAPA
    const data = await response.json();
    alert(data.message);
    location.reload();
});

async function loadPlaces() {
    const res = await fetch('/api/places');
    const places = await res.json();

    // Recorre cada lugar y agrega un marcador
    places.forEach(place => {
        const [lng, lat] = place.location.coordinates;

        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(
                `<strong>${place.name}</strong><br>${place.description}`
            );
    });
}

loadPlaces();
