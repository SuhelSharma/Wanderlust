
// Initialize MapTiler SDK
maptilersdk.config.apiKey = mapToken; // Replace with your MapTiler API key
// map.js





  const map = new maptilersdk.Map({
    container: 'map',
    style: "bright-v2",
    center: listing.geometry.coordinates, // Use provided coordinates as map center
    zoom: 7 // Example zoom level
  });

  // Function to add a marker

    const marker = new maptilersdk.Marker()
     .setLngLat(listing.geometry.coordinates)
    
     .setPopup(new maptilersdk.Popup({offset:25}).setHTML(
      `<h5>${listing.title}</h5><p>Exact location will be provided after booking</p>`)) // add popup
     .addTo(map)
      .addTo(map);
  

 