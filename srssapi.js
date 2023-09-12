const locations = [
    { name: "DUR", latitude: 36.018921, longitude: -78.920620 },
    { name: "MOR", latitude: 35.732057, longitude: -81.685756 }
];

const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

const fetchPromises = [];

locations.forEach(location => {
    const apiUrl = `https://api.sunrise-sunset.org/json?lat=${location.latitude}&lng=${location.longitude}&formatted=0`;
    const fetchPromise = fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const sunriseUTC = data.results.sunrise;
            const sunsetUTC = data.results.sunset;

            const sunriseLocal = new Date(sunriseUTC);
            const sunsetLocal = new Date(sunsetUTC);
            
            const sunriseSunsetInfo = document.getElementById("srss");
            sunriseSunsetInfo.innerHTML += `
                <p>${location.name} Sunrise: ${sunriseLocal.toLocaleTimeString([], timeOptions)}</p>
                <p>${location.name} Sunset : ${sunsetLocal.toLocaleTimeString([], timeOptions)}</p>
            `;
        })
        .catch(error => {
            console.error(`Error fetching sunrise and sunset data for ${location.name}:`, error);
        });

    fetchPromises.push(fetchPromise);
});