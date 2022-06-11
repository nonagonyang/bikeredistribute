/* eslint-disable no-undef */
/**
 * Many markers
 */
// config map
 let config = {
  minZoom: 7,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 18;

// co-ordinates
const lat = 51.5182516; 
const lng = -0.0890625;

async function main(){
  const bikeCoords = await getBikeStops()
  // calling map
  const map = L.map("map", config).setView([lat, lng], zoom);
// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

bikeCoords.map(({lat,lon, numBikes, numDocks, numEmptyDocks, name}) => {

  marker = new L.marker([lat, lon]).bindPopup(`${name} (${numEmptyDocks} docks empty) with ${numBikes} bikes available`).addTo(map);
})
}


// fetch bikestops, bike numbers, dock numbers
async function getBikeStops(){
  let response=await fetch("https://api.tfl.gov.uk/BikePoint/")
  let data=await response.json()
  let coords = data.map(({lat,lon, commonName, additionalProperties}) => ({
    lat,
    lon,
    name: commonName,
    numBikes: parseInt(additionalProperties[6].value),
    numDocks: parseInt(additionalProperties[8].value),
    numEmptyDocks: parseInt(additionalProperties[7].value),
  }))
  return coords
}
// getBikeStops().then(nBikes=> console.log(nBikes))



main()