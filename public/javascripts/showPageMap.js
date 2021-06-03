mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: spot.geometry.coordinates, // starting position [lng, lat]
  zoom: 13 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(spot.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
      `
        <h6 class="d-grid gap-2 d-md-flex justify-content-center"><strong>${spot.title}<strong></h6>
        <div class="d-grid gap-2 d-md-flex justify-content-center">
          <p>${spot.location}</p>
        </div>
        <div class="d-grid gap-2 d-md-flex justify-content-center">
          <a class="btn btn-outline-success btn-sm" href="https://www.google.com/maps/search/?api=1&query=${spot.location},${spot.city}">NAVIGATE</a>
        </div>
      `
    )
  )
  .addTo(map);
