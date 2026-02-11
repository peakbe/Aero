// Clés API (à remplacer)
const WEATHER_API_KEY = "ersegQzkf2Dfal-o26B4b5uzMrXBeHK2jOpOaY7nffc";
const AVIATION_API_KEY = "f906d7a42011f1752112a2e10a1d827e";

// Fonction pour récupérer la météo
async function fetchWeather(icao) {
    const url = `https://api.meteoapi.com/v1/airport?icao=${icao}&key=${WEATHER_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Fonction pour récupérer les vols
async function fetchFlights(icao) {
    const url = `https://api.aviationapi.com/v1/flights?icao=${icao}&key=${AVIATION_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Fonction pour déterminer le sens de piste
function getRunwayDirection(windDirection) {
    // Logique simplifiée : à adapter selon les pistes réelles de EBLG/EBCI
    return windDirection < 180 ? "Piste 04" : "Piste 22";
}

// Fonction pour afficher les données
async function displayData() {
    const airports = ["EBLG", "EBCI"];
    for (const icao of airports) {
        const weather = await fetchWeather(icao);
        const flights = await fetchFlights(icao);

        const airportDiv = document.getElementById(icao.toLowerCase());
        airportDiv.querySelector(".weather").innerHTML = `
            <p>Température: ${weather.temp}°C</p>
            <p>Vent: ${weather.windSpeed} kt, direction ${weather.windDirection}°</p>
        `;

        const runway = getRunwayDirection(weather.windDirection);
        airportDiv.querySelector(".runway").innerHTML = `<p>Sens de piste: ${runway}</p>`;

        const flightsList = flights.map(f => `<li>${f.flightNumber} (${f.airline}) - ${f.status}</li>`).join("");
        airportDiv.querySelector(".flights").innerHTML = `<ul>${flightsList}</ul>`;

        // Exemple de données sonomètres (à adapter selon ton API)
        airportDiv.querySelector(".sonometers").innerHTML = `
            <p>Sonomètre 1: 65 dB</p>
            <p>Sonomètre 2: 72 dB</p>
        `;
    }
}

displayData();
