class LeafletMap {

    constructor(containerId, center, zoom) {
        this.map = L.map(containerId).setView(center, zoom);
        this.initTileLayer();
    }

    initTileLayer() {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

    convertTemperature(temperature, unit = 'C') {
        if (unit === 'F') {
            return (temperature * 9/5) + 32;
        }
        return temperature;
    }

    addMarker(lat, lng, message, temperature, unit = 'C') {
        const marker = L.marker([lat, lng]).addTo(this.map);
        const tempInPreferredUnit = this.convertTemperature(temperature, unit);
        const popupMessage = `${message}<br>Temperature: ${tempInPreferredUnit}°${unit}`;
        marker.bindPopup(popupMessage);
    }

    loadMarkersFromJson(url, unit = 'C') {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach(marker => {
                    this.addMarker(marker.latitude, marker.longitude, marker.message, marker.temperature, unit);
                });
            })
            .catch(error => console.error('Error loading markers:', error));
    }
}

const myMap = new LeafletMap('map', [45.4215, -75.6972], 5);
myMap.loadMarkersFromJson('app.json', 'F');
