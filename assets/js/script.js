const apiKey = "b16bcb3129dbbd85f3fc0fe8915cd45b";
let cityName = "";
const searchEl = document.getElementById("search-entry");

function geoAPI() {
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},&limit=1&appid=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length == 0) {
        alert("Location not foun112d");
      } else {
        weatherAPI(data[0].lat, data[0].lon);
      }
    });
}
