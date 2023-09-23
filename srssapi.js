const locations = [
    { name: "DUR", latitude: 36.018921, longitude: -78.920620 },
    { name: "MOR", latitude: 35.732057, longitude: -81.685756 }
];

const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

function fetchSunriseSunset() {
    const morganton = document.getElementById("mor");

    const selectedLocation = morganton.checked ? "MOR" : "DUR";
    
    const apiUrl = `https://api.sunrise-sunset.org/json?lat=${locations.find(loc => loc.name === selectedLocation).latitude}&lng=${locations.find(loc => loc.name === selectedLocation).longitude}&formatted=0`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const sunriseUTC = data.results.sunrise;
            const sunsetUTC = data.results.sunset;

            const sunriseLocal = new Date(sunriseUTC);
            const sunsetLocal = new Date(sunsetUTC);

            const sunriseSunsetInfo = document.getElementById("srss");
            sunriseSunsetInfo.innerHTML = `
                <p>SUNRISE/SUNSET INFO</p>
                <p>${selectedLocation} Sunrise: ${sunriseLocal.toLocaleTimeString([], timeOptions)}</p>
                <p>${selectedLocation} Sunset : ${sunsetLocal.toLocaleTimeString([], timeOptions)}</p>
            `;
        })
        .catch(error => {
            console.error(`Error fetching sunrise and sunset data for ${selectedLocation}:`, error);
        });
}

// call sunrise/sunset function during page load
window.addEventListener('load', () => {
    const morganton = document.getElementById("mor");
    morganton.checked = getCheckboxStateFromCookie();
    fetchSunriseSunset();
});

// update when ticked
document.getElementById("mor").addEventListener("change", fetchSunriseSunset);
document.getElementById("sunriseSunset").addEventListener("change", fetchSunriseSunset);
