document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu div');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(menuItem => menuItem.classList.remove('active'));
            this.classList.add('active');
        });
    });

    fetchWeather('Islamabad');

    document.getElementById('search').addEventListener('submit', function(event) {
        event.preventDefault();
        const city = document.getElementById('searchInput').value;
        fetchWeather(city);
    });

    document.getElementById('unitToggle').addEventListener('change', function() {
        const isFahrenheit = this.checked;
        const tempCelsius = parseFloat(document.getElementById('temp').getAttribute('data-temp'));
        const feelsLikeCelsius = parseFloat(document.getElementById('feels').getAttribute('data-feels'));
        updateTemperatureDisplay(isFahrenheit, tempCelsius, feelsLikeCelsius);
    });
});

// Hamburger menu toggle
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
}

const apiKey = '21a6eeea5abdc8c1cd8c9fc856157d76';

async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('weatherInfo').style.display = 'none';
        document.getElementById('data').style.display = 'none';

        const response = await fetch(url);
        const data = await response.json();

        if (response.status !== 200) {
            throw new Error(`Error: ${data.message}`);
        }

        const tempCelsius = data.main.temp;
        const feelsLikeCelsius = data.main.feels_like;

        updateTemperatureDisplay(false, tempCelsius, feelsLikeCelsius);
        
        document.getElementById('temp').setAttribute('data-temp', tempCelsius);
        document.getElementById('feels').setAttribute('data-feels', feelsLikeCelsius);

        document.getElementById('city').innerHTML = data.name;
        document.getElementById('type').innerHTML = data.weather[0].description;

        const iconCode = data.weather[0].icon;
        document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        document.getElementById('sunrise').innerHTML = `Sunrise: ${sunriseTime}`;
        document.getElementById('sunset').innerHTML = `Sunset: ${sunsetTime}`;
        document.getElementById('humidity').innerHTML = `Humidity: ${data.main.humidity}%`;
        document.getElementById('wind_speed').innerHTML = `Wind Speed: ${data.wind.speed} m/s`;
        document.getElementById('pressure').innerHTML = `Pressure: ${data.main.pressure} hPa`;

        const currentTime = data.dt;
        const sunrise = data.sys.sunrise;
        const sunset = data.sys.sunset;

        updateWeatherBackground(data.weather[0].description, currentTime, sunrise, sunset);

        document.getElementById('loading').style.display = 'none';
        document.getElementById('weatherInfo').style.display = 'flex';
        document.getElementById('data').style.display = 'flex';

    } catch (error) {
        console.error('Error fetching weather data:', error);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function updateTemperatureDisplay(isFahrenheit, tempCelsius, feelsLikeCelsius) {
    let temp, feelsLike;

    if (isFahrenheit) {
        temp = (tempCelsius * 9/5) + 32;
        feelsLike = (feelsLikeCelsius * 9/5) + 32;
        document.getElementById('temp').innerHTML = `${temp.toFixed(1)} °F`;
        document.getElementById('feels').innerHTML = `Feels like: ${feelsLike.toFixed(1)} °F`;
    } else {
        temp = tempCelsius;
        feelsLike = feelsLikeCelsius;
        document.getElementById('temp').innerHTML = `${temp} °C`;
        document.getElementById('feels').innerHTML = `Feels like: ${feelsLike} °C`;
    }
}

function updateWeatherBackground(weatherDescription, currentTime, sunrise, sunset) {
    const weatherInfoDiv = document.getElementById('weatherInfo');
    let backgroundImage;

    const isDayTime = currentTime >= sunrise && currentTime <= sunset;

    if (weatherDescription === 'clear sky') {
        backgroundImage = isDayTime ? 'assets/clearsky.png' : 'assets/nighty.jpg';
    } else if (weatherDescription.includes('clouds')) {
        backgroundImage = 'assets/cloudds.jpg';
    } else if (weatherDescription.includes('rain')) {
        backgroundImage = 'assets/rain.jpg';
    } else if (['smoke', 'mist', 'fog'].some(condition => weatherDescription.includes(condition))) {
        backgroundImage = 'assets/smoke.jpg';
    } else {
        backgroundImage = 'assets/default_back.jpg';
    }

    weatherInfoDiv.style.backgroundImage = `url(${backgroundImage})`;
    weatherInfoDiv.style.backgroundSize = 'cover';
}
