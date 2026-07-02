


window.addEventListener("DOMContentLoaded", () => {

    // const apiKey = MAP_TOKEN;

    const map = new maplibregl.Map({
    container: "map",
    style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${apiKey}`,
    center: coordinates,
    zoom: 10
});

// console.log(map.getCenter());


    map.addControl(new maplibregl.NavigationControl());
    map.on("load", () => {
        new maplibregl.Marker({
            color: "#fe424d"
        })
        .setLngLat(coordinates)
        .setPopup(new maplibregl.Popup().setText("Welcome to Wanderlust"))
        .addTo(map);
    });

});