const locations = [
    { name: "DUR", latitude: 36.018921, longitude: -78.920620 },
    { name: "MOR", latitude: 35.732057, longitude: -81.685756 }
];

const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

const fetchPromises = locations.map(location => {
    const apiUrl = `https://api.sunrise-sunset.org/json?lat=${location.latitude}&lng=${location.longitude}&formatted=0`;
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const sunriseUTC = data.results.sunrise;
            const sunsetUTC = data.results.sunset;

            const sunriseLocal = new Date(sunriseUTC);
            const sunsetLocal = new Date(sunsetUTC);

            return {
                name: location.name,
                sunrise: sunriseLocal.toLocaleTimeString([], timeOptions),
                sunset: sunsetLocal.toLocaleTimeString([], timeOptions)
            };
        })
        .catch(error => {
            console.error(`Error fetching sunrise and sunset data for ${location.name}:`, error);
            return {
                name: location.name,
                sunrise: 'N/A',
                sunset: 'N/A'
            };
        });
});

Promise.all(fetchPromises)
    .then(results => {
        results.sort((a, b) => {
            return locations.findIndex(loc => loc.name === a.name) - locations.findIndex(loc => loc.name === b.name);
        });

        const sunriseSunsetInfo = document.getElementById("srss");
        results.forEach(result => {
            sunriseSunsetInfo.innerHTML += `
                <p>${result.name} Sunrise: ${result.sunrise}</p>
                <p>${result.name} Sunset : ${result.sunset}</p>
            `;
        });
    })
    .catch(error => {
        console.error("Error fetching sunrise and sunset data:", error);
    });
