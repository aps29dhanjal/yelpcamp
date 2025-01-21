
mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});
new mapboxgl.Marker({color: 'blue'})
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(`<h3> ${campground.title}</h3>`)
)
.addTo(map);
map.addControl(new mapboxgl.NavigationControl());