document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherForecast('Islamabad');

    document.getElementById('search').addEventListener('submit', function(event) {
        event.preventDefault();
        const city = document.getElementById('searchInput').value;
        fetchWeatherForecast(city);
    });
});

let barChart, doughnutChart, lineChart;

async function fetchWeatherForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const forecastData = await response.json();

        if (response.status !== 200) {
            throw new Error(`Error: ${forecastData.message}`);
        }

        createCharts(forecastData); 


    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function createCharts(forecastData) {
    // Destroy existing charts if they exist
    if (barChart) barChart.destroy();
    if (doughnutChart) doughnutChart.destroy();
    if (lineChart) lineChart.destroy();

    const dailyForecasts = forecastData.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));
    const labels = dailyForecasts.map(forecast => new Date(forecast.dt * 1000).toLocaleDateString());
    const temperatures = dailyForecasts.map(forecast => forecast.main.temp);

    // Bar chart for temperatures
    const barChartCtx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(barChartCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            animation: {
                duration: 1000,
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)',
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 1)',
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 1)',
                    }
                }
            }
        }
    });

    // Doughnut chart for weather conditions
    const weatherConditions = {};
    dailyForecasts.forEach(forecast => {
        const condition = forecast.weather[0].main;
        weatherConditions[condition] = (weatherConditions[condition] || 0) + 1;
    });

    const doughnutChartCtx = document.getElementById('doughnutChart').getContext('2d');
    doughnutChart = new Chart(doughnutChartCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(weatherConditions),
            datasets: [{
                label: 'Weather Conditions',
                data: Object.values(weatherConditions),
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1000
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255, 255, 255, 1)',
                    }
                }
            }
        }
    });

    // Line chart for temperature changes
    const lineChartCtx = document.getElementById('lineChart').getContext('2d');
    lineChart = new Chart(lineChartCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature Changes (°C)',
                data: temperatures,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
                borderWidth: 2,
            }]
        },
        options: {
            animation: {
                duration: 1000,
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)',
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 1)',
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 1)',
                    }
                }
            }
        }
    });
}

// function createWeatherTable(forecastList) {
//     const tableBody = document.querySelector('#weatherTable tbody');
    
//     if (!tableBody) {
//         console.error('Table element not found');
//         return;
//     }
    
//     const rowsPerPage = 10;
//     let currentPage = 1;

//     function renderTablePage(pageNumber) {
//         const start = (pageNumber - 1) * rowsPerPage;
//         const end = Math.min(start + rowsPerPage, forecastList.length);
//         const currentForecasts = forecastList.slice(start, end);

//         tableBody.innerHTML = ''; // Clear table before adding new rows

//         currentForecasts.forEach(forecast => {
//             const row = document.createElement('tr');
//             const dateCell = document.createElement('td');
//             const tempCell = document.createElement('td');
//             const conditionCell = document.createElement('td');

//             const date = new Date(forecast.dt * 1000).toLocaleString();
//             const temp = forecast.main.temp;
//             const condition = forecast.weather[0].main;

//             dateCell.textContent = date;
//             tempCell.textContent = `${temp}°C`;
//             conditionCell.textContent = condition;

//             row.appendChild(dateCell);
//             row.appendChild(tempCell);
//             row.appendChild(conditionCell);

//             tableBody.appendChild(row);
//         });

//         updatePagination();
//     }

//     function updatePagination() {
//         const totalPages = Math.ceil(forecastList.length / rowsPerPage);
//         const currentPageSpan = document.getElementById('currentPage');
//         currentPageSpan.textContent = `Page ${currentPage}`;

//         const prevButton = document.getElementById('prevPage');
//         const nextButton = document.getElementById('nextPage');

//         prevButton.disabled = currentPage === 1;
//         nextButton.disabled = currentPage === totalPages;

//         // Event listeners for pagination buttons
//         prevButton.onclick = () => {
//             if (currentPage > 1) {
//                 currentPage--;
//                 renderTablePage(currentPage);
//             }
//         };

//         nextButton.onclick = () => {
//             if (currentPage < totalPages) {
//                 currentPage++;
//                 renderTablePage(currentPage);
//             }
//         };
//     }

//     renderTablePage(currentPage);
// }
