/* =========================
   Helpers géo & icônes
   ========================= */

// Haversine destination point à partir d'un point (lat, lon), d'un cap (deg) et distance en km
function destPoint(lat, lon, bearingDeg, distanceKm){
  const R = 6371; // km
  const brng = bearingDeg * Math.PI/180;
  const dR = distanceKm / R;
  const lat1 = lat * Math.PI/180;
  const lon1 = lon * Math.PI/180;

  const lat2 = Math.asin(Math.sin(lat1)*Math.cos(dR) + Math.cos(lat1)*Math.sin(dR)*Math.cos(brng));
  const lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(dR)*Math.cos(lat1), Math.cos(dR)-Math.sin(lat1)*Math.sin(lat2));
  return { lat: lat2*180/Math.PI, lon: lon2*180/Math.PI };
}

// Icône avion (SVG + rotation) – color: hex/css, heading en degrés
function aircraftDivIcon(color, heading=0){
  const svg = `
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
       style="transform: rotate(${heading}deg); transform-origin: 50% 50%;">
    <path d="M12 2l2.5 6.5H21l-6 5 2.3 7.5L12 16l-5.3 5 2.3-7.5-6-5h6.5L12 2z"
      fill="${color}" stroke="white" stroke-width="0.7" />
  </svg>`;
  return L.divIcon({
    className: "aircraft-icon",
    html: svg,
    iconSize: [26,26],
    iconAnchor: [13,13],
    popupAnchor: [0,-12]
  });
}

// Icône sonomètre (bleu foncé)
function noiseDivIcon(){
  const svg = `
  <svg width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8" fill="#001a4d" stroke="#bcd1ff" stroke-width="1.2"/>
    <rect x="11" y="7" width="2" height="10" rx="1" fill="#bcd1ff"/>
    <circle cx="12" cy="12" r="2" fill="#bcd1ff"/>
  </svg>`;
  return L.divIcon({
    className: "noise-icon",
    html: svg,
    iconSize: [24,24],
    iconAnchor: [12,12]
  });
}

/* =========================
   Initialisation
   ========================= */
const airport = CONFIG.airports[0];
const map = L.map('map', { zoomControl:true }).setView([airport.lat, airport.lon], 12);

// Basemap sombre Carto
L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { attribution: '&copy; OpenStreetMap, &copy; CARTO' }
).addTo(map);

// Couches
const layerCorridors = L.layerGroup().addTo(map);
const layerNoise = L.layerGroup().addTo(map);
const layerDeps = L.layerGroup().addTo(map);
const layerArrs = L.layerGroup().addTo(map);
const layerOver = L.layerGroup().addTo(map);

// Marker aéroport
L.marker([airport.lat, airport.lon]).addTo(map)
 .bindPopup(`<b>${airport.name}</b><br>${airport.code}`);

// Bouton thème
document.getElementById('toggleTheme').addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
});

/* =========================
   Couloirs départ / arrivée
   ========================= */
function drawCorridors(){
  layerCorridors.clearLayers();
  const c = CONFIG.corridors;
  const center = { lat: c.runway_center.lat, lon: c.runway_center.lon };

  // Ligne centre pour départ (runway 23 vers cap 230°)
  const depEnd = destPoint(center.lat, center.lon, c.dep_bearing_deg, c.length_km);
  const depLine = L.polyline([[center.lat, center.lon], [depEnd.lat, depEnd.lon]], {
    color: '#ff8c3a', weight: 4, opacity: 0.8
  }).addTo(layerCorridors).bindPopup('<b>Couloir Départ (RWY 23)</b>');

  // Ligne centre pour arrivée (runway 05 depuis cap 050° vers la piste)
  const arrStart = destPoint(center.lat, center.lon, c.arr_bearing_deg, c.length_km);
  const arrLine = L.polyline([[arrStart.lat, arrStart.lon], [center.lat, center.lon]], {
    color: '#3aa3ff', weight: 4, opacity: 0.8
  }).addTo(layerCorridors).bindPopup('<b>Couloir Arrivée (RWY 05)</b>');

  // Optionnel : traits latéraux pour visualiser un “couloir”
  const offset = 0.8; // ≈ km latéral
  const depLeft = destPoint(center.lat, center.lon, c.dep_bearing_deg - 2, c.length_km);
  const depRight = destPoint(center.lat, center.lon, c.dep_bearing_deg + 2, c.length_km);
  L.polyline([[center.lat, center.lon], [depLeft.lat, depLeft.lon]], { color:'#ff8c3a', weight:1.5, opacity:0.6, dashArray:'4 6' }).addTo(layerCorridors);
  L.polyline([[center.lat, center.lon], [depRight.lat, depRight.lon]], { color:'#ff8c3a', weight:1.5, opacity:0.6, dashArray:'4 6' }).addTo(layerCorridors);

  const arrLeft = destPoint(center.lat, center.lon, c.arr_bearing_deg - 2, c.length_km);
  const arrRight = destPoint(center.lat, center.lon, c.arr_bearing_deg + 2, c.length_km);
  L.polyline([[arrLeft.lat, arrLeft.lon], [center.lat, center.lon]], { color:'#3aa3ff', weight:1.5, opacity:0.6, dashArray:'4 6' }).addTo(layerCorridors);
  L.polyline([[arrRight.lat, arrRight.lon], [center.lat, center.lon]], { color:'#3aa3ff', weight:1.5, opacity:0.6, dashArray:'4 6' }).addTo(layerCorridors);
}
drawCorridors();

/* =========================
   Sonomètres
   ========================= */
function renderNoise(){
  layerNoise.clearLayers();
  const container = document.getElementById('noise-list');
  container.innerHTML = '';
  const monitors = CONFIG.noiseMonitors[airport.code] || [];
  monitors.forEach(m => {
    const marker = L.marker([m.lat, m.lon], { icon: noiseDivIcon() })
      .addTo(layerNoise)
      .bindPopup(`<b>${m.id}</b><br>${m.name}`);
    const li = document.createElement('li');
    li.textContent = `${m.id} – ${m.name}`;
    container.appendChild(li);
  });
}
renderNoise();

/* =========================
   METAR / TAF (AVWX)
   ========================= */
async function loadMETAR_TAF(){
  const w = document.getElementById('weather');
  try{
    const metarUrl = `https://avwx.rest/api/metar/${airport.code}?format=json&token=${encodeURIComponent(CONFIG.avwxToken)}`;
    const tafUrl   = `https://avwx.rest/api/taf/${airport.code}?format=json&token=${encodeURIComponent(CONFIG.avwxToken)}`;

    const [metarRes, tafRes] = await Promise.all([ fetch(metarUrl), fetch(tafUrl) ]);
    if(!metarRes.ok) throw new Error('METAR: HTTP '+metarRes.status);
    if(!tafRes.ok) throw new Error('TAF: HTTP '+tafRes.status);

    const metar = await metarRes.json();
    const taf = await tafRes.json();

    const temp = metar?.temperature?.value ?? '—';
    const wind = metar?.wind_speed?.value ?? '—';
    const vis  = metar?.visibility?.value ?? (metar?.visibility?.repr ?? '—');

    w.innerHTML = `
      <h2>Météo (METAR/TAF)</h2>
      <div><b>METAR (${airport.code})</b></div>
      <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; background:#0b1120; border:1px solid #22304a; padding:6px; border-radius:8px; margin:6px 0 8px 0;">
        ${metar?.raw ?? '—'}
      </div>
      <div style="font-size:13px; color:#c9d7ee;">
        Temp: <b>${temp}°C</b> · Vent: <b>${wind} kt</b> · Visibilité: <b>${vis}</b>
      </div>

      <div style="margin-top:10px;"><b>TAF (${airport.code})</b></div>
      <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; background:#0b1120; border:1px solid #22304a; padding:6px; border-radius:8px;">
        ${taf?.raw ?? '—'}
      </div>
    `;
  }catch(e){
    w.innerHTML = `<h2>Météo (METAR/TAF)</h2><p class="loading">Erreur chargement METAR/TAF : ${e.message}</p>`;
  }
}

// Premier chargement + intervalle 5 minutes
loadMETAR_TAF();
setInterval(loadMETAR_TAF, 5 * 60 * 1000);

/* =========================
   Trafic AirLabs (live)
   ========================= */
// Nettoyage des listes
function clearFlightLists(){
  document.getElementById('list-deps').innerHTML = '';
  document.getElementById('list-arrs').innerHTML = '';
  document.getElementById('list-over').innerHTML = '';
}

function addListItem(ulId, text){
  const li = document.createElement('li');
  li.textContent = text;
  document.getElementById(ulId).appendChild(li);
}

function flightLabel(f){
  const callsign = f.flight_iata || f.flight_icao || f.callsign || '—';
  const reg = f.reg_number ? ` · ${f.reg_number}` : '';
  const alt = f.alt ? ` · ${Math.round(f.alt)} ft` : '';
  return `${callsign}${reg}${alt}`;
}

async function loadFlights(){
  try{
    // Effacer calques
    layerDeps.clearLayers();
    layerArrs.clearLayers();
    layerOver.clearLayers();
    clearFlightLists();

    // Requêtes parallèles
    const key = encodeURIComponent(CONFIG.aviationApiKey);
    const depUrl = `https://api.airlabs.co/v9/flights?dep_iata=LGG&api_key=${key}`;
    const arrUrl = `https://api.airlabs.co/v9/flights?arr_iata=LGG&api_key=${key}`;
    // Survols dans un rayon ~50 km
    const overUrl = `https://api.airlabs.co/v9/flights?lat=${airport.lat}&lng=${airport.lon}&distance=50&api_key=${key}`;

    const [depRes, arrRes, overRes] = await Promise.all([ fetch(depUrl), fetch(arrUrl), fetch(overUrl) ]);
    const [depData, arrData, overData] = await Promise.all([ depRes.json(), arrRes.json(), overRes.json() ]);

    const departures = Array.isArray(depData?.response) ? depData.response : [];
    const arrivals   = Array.isArray(arrData?.response) ? arrData.response : [];
    const overs      = Array.isArray(overData?.response) ? overData.response : [];

    // Départs = orange
    departures.forEach(f => {
      if(!f.lat || !f.lng) return;
      const icon = aircraftDivIcon('#ff8c3a', f.dir || 0);
      L.marker([f.lat, f.lng], { icon }).addTo(layerDeps)
        .bindPopup(`<b>Départ</b><br>${flightLabel(f)}`);
      addListItem('list-deps', flightLabel(f));
    });

    // Arrivées = bleu
    arrivals.forEach(f => {
      if(!f.lat || !f.lng) return;
      const icon = aircraftDivIcon('#3aa3ff', f.dir || 0);
      L.marker([f.lat, f.lng], { icon }).addTo(layerArrs)
        .bindPopup(`<b>Arrivée</b><br>${flightLabel(f)}`);
      addListItem('list-arrs', flightLabel(f));
    });

    // Survols = violet
    overs.forEach(f => {
      if(!f.lat || !f.lng) return;
      const icon = aircraftDivIcon('#a36bff', f.dir || 0);
      L.marker([f.lat, f.lng], { icon }).addTo(layerOver)
        .bindPopup(`<b>Survol</b><br>${flightLabel(f)}`);
      addListItem('list-over', flightLabel(f));
    });

  }catch(e){
    // En cas d’erreur, garder l’état précédent
    console.warn('Erreur chargement AirLabs', e);
    if(!document.getElementById('list-deps').childElementCount){
      addListItem('list-deps', 'Erreur chargement trafic');
      addListItem('list-arrs', 'Erreur chargement trafic');
      addListItem('list-over', 'Erreur chargement trafic');
    }
  }
}

// Premier chargement + refresh 15 s
loadFlights();
setInterval(loadFlights, 15 * 1000);
