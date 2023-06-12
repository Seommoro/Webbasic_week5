const geoJasonFetcher = async () => {
  const url =
    "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
  const response = await fetch(url);
  const data = await response.json();
  const posMigrationUrl =
    "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f";
  const negMigrationUrl =
    "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e";

  const posResponse = await fetch(posMigrationUrl);
  const negResponse = await fetch(negMigrationUrl);
  const posData = await posResponse.json();
  const negData = await negResponse.json();

  mapInitializer(data, posData, negData);
};
const mapInitializer = (data, posData, negData) => {
  console.log(data);
  console.log(posData);
  console.log(negData);
  let map = L.map("map", {
    minZoom: -3
  });

  let geoJson = L.geoJson(data, {
    weight: 2,
    onEachFeature: getFeature
  }).addTo(map);

  let osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "OpenStreetMap"
  }).addTo(map);

  map.fitBounds(geoJson.getBounds());
};

const getFeature = (feature, layer) => {
  if (!feature.properties.name) return;
  layer.on("mouseover", () => {
    const id = feature.properties.name;
    //console.log(id);
    layer.bindTooltip(id);
  });
};

geoJasonFetcher();
