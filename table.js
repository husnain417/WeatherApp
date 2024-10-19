document.addEventListener('DOMContentLoaded', () => {
    let forecastList = [];

    fetchWeatherForecast('Islamabad');

    document.getElementById('search').addEventListener('submit', function(event) {
        event.preventDefault();
        const city = document.getElementById('searchInput').value;
        fetchWeatherForecast(city);
        document.getElementById('city1').textContent = city;
    });

    document.getElementById('filters').addEventListener('change', function() {
        const filterType = this.value;
        applyFilter(filterType);
    });

    async function fetchWeatherForecast(city) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            const forecastData = await response.json();

            if (response.status !== 200) {
                throw new Error(`Error: ${forecastData.message}`);
            }

            forecastList = forecastData.list;
            createWeatherTable(forecastList);

        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    function applyFilter(filterType) {
        let filteredList = [...forecastList]; 

        switch (filterType) {
            case 'ascTemp':
                filteredList.sort((a, b) => a.main.temp - b.main.temp);
                break;
            case 'descTemp':
                filteredList.sort((a, b) => b.main.temp - a.main.temp);
                break;
            case 'rainyDays':
                filteredList = filteredList.filter(item => item.weather[0].main.toLowerCase().includes('rain'));
                break;
            case 'highestTemp':
                const highestTempDay = filteredList.reduce((max, item) => item.main.temp > max.main.temp ? item : max, filteredList[0]);
                filteredList = [highestTempDay];
                break;
            default:
                filteredList = forecastList;
        }

        createWeatherTable(filteredList);
    }

    function createWeatherTable(forecastList) {
        const tableBody = document.querySelector('#weatherTable tbody');
        
        if (!tableBody) {
            console.error('Table element not found');
            return;
        }
        
        const rowsPerPage = 10;
        let currentPage = 1;

        function renderTablePage(pageNumber) {
            const start = (pageNumber - 1) * rowsPerPage;
            const end = Math.min(start + rowsPerPage, forecastList.length);
            const currentForecasts = forecastList.slice(start, end);

            tableBody.innerHTML = ''; // Clear table before adding new rows

            currentForecasts.forEach(forecast => {
                const row = document.createElement('tr');
                const dateCell = document.createElement('td');
                const tempCell = document.createElement('td');
                const conditionCell = document.createElement('td');

                const date = new Date(forecast.dt * 1000).toLocaleString();
                const temp = forecast.main.temp;
                const condition = forecast.weather[0].main;

                dateCell.textContent = date;
                tempCell.textContent = `${temp}°C`;
                conditionCell.textContent = condition;

                row.appendChild(dateCell);
                row.appendChild(tempCell);
                row.appendChild(conditionCell);

                tableBody.appendChild(row);
            });

            updatePagination();
        }

        function updatePagination() {
            const totalPages = Math.ceil(forecastList.length / rowsPerPage);
            const currentPageSpan = document.getElementById('currentPage');
            currentPageSpan.textContent = `Page ${currentPage}`;

            const prevButton = document.getElementById('prevPage');
            const nextButton = document.getElementById('nextPage');

            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === totalPages;

            prevButton.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderTablePage(currentPage);
                }
            };

            nextButton.onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderTablePage(currentPage);
                }
            };
        }

        renderTablePage(currentPage);
    }
});
