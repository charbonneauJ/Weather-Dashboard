const apiKey = "3ce0e93ec9171e05a543af1ac66cdf25";
const searchInputEL = document.getElementById("search-input");
const searchButtonEL = document.getElementById("search-button");
const currentDayTempEL = document.getElementById("current-day-temp");
let searchHistory = [];
function init() {
  searchHistory = reading();
  populateSearchHistory(searchHistory);
}
function reading() {
  let data = localStorage.getItem("searchHistory");
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

function writing(city) {
  const data = reading();
  data.push(city);
  localStorage.setItem("searchHistory", JSON.stringify(data));
}
function populateSearchHistory(data) {
  const historyEl = document.getElementById("search-history");
  historyEl.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const city = data[i];
    const button = document.createElement("button");
    button.textContent = city;
    button.addEventListener("click", function () {
      getCoordinates(city);
    });
    historyEl.appendChild(button);
  }
}

function populateCurrentWeather(data) {
  const currentWeatherEl = document.getElementById("current-weather");
  currentWeatherEl.innerHTML = "";
  const currentDayEl = document.createElement("div");
  currentDayEl.innerHTML = `
    <h2>${data.city} (${new Date().toLocaleDateString()})</h2>
    <p>Temp: ${data.main.temp}</p>
    <p>Wind: ${data.wind.speed}</p>
    <p>Humidity: ${data.main.humidity}</p>
    <p>UV Index: ${data.main.uvi}</p>
    `;
  currentWeatherEl.appendChild(currentDayEl);
}

function populateForecast(array) {
  const forecastEl = document.getElementById("forecast");
  forecastEl.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const day = array[i];
    const dayEl = document.createElement("div");
    dayEl.innerHTML = `
        <h3>${day.dt_txt}</h3>
        <p>Temp: ${day.main.temp}</p>
        <p>Wind: ${day.wind.speed}</p>
        <p>Humidity: ${day.main.humidity}</p>
        `;
    forecastEl.appendChild(dayEl);
  }
}

const getForecast = function (lat, lon) {
  console.log(lat, lon);
  const weatherURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  fetch(weatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const filterData = [];
      for (let i = 0; i < data.list.length; i += 8) {
        const element = data.list[i];
        filterData.push(element);
      }
      filterData.push(data.list.at(-1));
      populateCurrentWeather(filterData[0]);
      populateForecast(filterData.slice(1));
    });
};

const getCoordinates = function (cityName) {
  const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

  fetch(geoURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data[0].lat)
      // console.log(data[0].lon)
      getForecast(data[0].lat, data[0].lon);
    });
};

searchButtonEL.addEventListener("click", function () {
  const searchValue = searchInputEL.value;
  getCoordinates(searchValue);
});
