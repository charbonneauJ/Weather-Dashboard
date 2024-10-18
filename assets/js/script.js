const apiKey = "3ce0e93ec9171e05a543af1ac66cdf25";
const searchInputEL = document.getElementById("search-input");
const searchButtonEL = document.getElementById("search-button");
const currentDayTempEL = document.getElementById("current-day-temp");


// const getRepoIssues = function (repo) {
//     const apiUrl = `https://api.github.com/repos/${repo}/issues?direction=asc`;
  
//     fetch(apiUrl).then(function (response) {
//       if (response.ok) {
//         response.json().then(function (data) {
//           displayIssues(data);
//           if (response.headers.get('Link')) {
//             displayWarning(repo);
//           }
//         });
//       } else {
//         document.location.replace('./index.html');
//       }
//     });
//   };
const getForecast = function(lat, lon) {
    console.log(lat, lon)
    const weatherURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(weatherURL)
        .then(function(response) {
            return response.json();

        })
        .then(function(data) {
            console.log(data);
            currentDayTempEL.textContent = `temp: ${data.list[4].main.temp}`;
        })
}

const getCoordinates = function (cityName) {
    const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    fetch(geoURL)
        .then(function(response) {
            return response.json()
        
        })
        .then(function(data) {
            // console.log(data[0].lat)
            // console.log(data[0].lon)
            getForecast(data[0].lat, data[0].lon)
        })
}



searchButtonEL.addEventListener("click", function() {
    const searchValue = searchInputEL.value;
    getCoordinates(searchValue)
})
