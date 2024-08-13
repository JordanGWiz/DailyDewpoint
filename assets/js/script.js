// API key and initial city variable
const apiKey = "b16bcb3129dbbd85f3fc0fe8915cd45b";
let city = "";

// Retrieve search history from local storage
let searchHistory = JSON.parse(localStorage.getItem("search-history")) || [];

// Reference HTML elements
const formEl = document.getElementById("city-search-form");
const searchBar = document.getElementById("city-search-input");
const searchHistoryEl = document.getElementById("city-search-history");

// Function to get city coordinates from the OpenWeatherMap API
function getCityCoordinates(city, apiKey) {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        alert("Location not found, please try searching for a city.");
      } else {
        let lat = data[0].lat;
        let lon = data[0].lon;
        getWeatherData(lat, lon, apiKey, city);
      }
    })
    .catch((error) => {
      console.error("Error fetching city coordinates:", error);
    });
}

// Function to get weather data based on latitude and longitude
function getWeatherData(lat, lon, apiKey, city) {
  let currentDate = new Date().toLocaleDateString();
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  )
    .then((response) => response.json())
    .then((data) => {
      if (!data.list || data.list.length === 0) {
        alert("Sorry, currently no weather information is available.");
      } else {
        updateDailyWeather(data, city, currentDate);
        updateDashboard(data);
      }
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

// Function to update the main weather section
function updateDailyWeather(data, city, currentDate) {
  if (data && data.list && data.list.length > 0) {
    const dayData = data.list[0];
    document.getElementById("current-city-name").textContent = city;
    document.getElementById("current-date-display").textContent = currentDate;
    document.getElementById(
      "current-temp"
    ).textContent = `${dayData.main.temp}\u00B0`;
    document.getElementById(
      "current-wind"
    ).textContent = `${dayData.wind.speed} mph`;
    document.getElementById(
      "current-humidity"
    ).textContent = `${dayData.main.humidity}%`;
  } else {
    console.error("No weather data available for today.");
  }
}

// Function to update the 5-day forecast
function updateDashboard(data) {
  if (data && data.list && data.list.length > 0) {
    for (let index = 0; index < 5; index++) {
      const dayIndex = index + 1;
      const forecast = data.list[index * 8];

      const tempElement = document.getElementById(
        `forecast-temp-day-${dayIndex}`
      );
      if (tempElement) {
        tempElement.textContent = forecast.main.temp + "\u00B0";
      }

      const windElement = document.getElementById(
        `forecast-wind-day-${dayIndex}`
      );
      if (windElement) {
        windElement.textContent = forecast.wind.speed + " mph";
      }

      const humidityElement = document.getElementById(
        `forecast-humidity-day-${dayIndex}`
      );
      if (humidityElement) {
        humidityElement.textContent = forecast.main.humidity + "%";
      }
    }
  } else {
    console.error("No weather data available to update the dashboard.");
  }
}

// Handle form submission to search for a city
function handleCitySearch(event) {
  event.preventDefault();
  city = searchBar.value.trim();
  if (city) {
    getCityCoordinates(city, apiKey);
    searchBar.value = "";
    searchHistory.push(city);
    localStorage.setItem("search-history", JSON.stringify(searchHistory));
    displaySearch();
  }
}

// Display search history as buttons
function displaySearch() {
  searchHistoryEl.innerHTML = ""; 
  searchHistory.forEach((city) => {
    const cityButton = document.createElement("button");
    cityButton.classList.add("cityButton");
    cityButton.textContent = city;
    cityButton.addEventListener("click", function () {
      getCityCoordinates(city, apiKey);
    });
    searchHistoryEl.append(cityButton);
  });
}

// Display search history on page load
if (searchHistory.length > 0) {
  displaySearch();
}

// Event listener for form submission
formEl.addEventListener("submit", handleCitySearch);
