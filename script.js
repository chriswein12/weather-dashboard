var apiKey = "2e1d35c035f3e53a227b30889160b667";

var citySearchFormEl = document.querySelector("#city-search-form");
var citySearchInputEl = document.querySelector("#search-input");
var citySearchBtnEl = document.querySelector("#search-button");
var historyEl = document.querySelector("#city-list");
var todaysWeatherEl = document.querySelector("#todays-weather");
var weeklyWeatherEl = document.querySelector("#weekly-weather");

function displayCities() {
    cities = JSON.parse(localStorage.getItem("cities")) || [];
    cities.reverse();
    console.log(cities);

    var limit;

    if (cities.length < 10) {
        limit = cities.length;
    } else {
        limit = 10;
    }

    for (i = 0; i < limit; i++) {
        var cityListEl = document.createElement("button");
        cityListEl.classList = "list-group-item list-group-item-action"
        cityListEl.id = "city-button-" + i;
        cityListEl.textContent = cities[i];

        historyEl.appendChild(cityListEl);
    }
}

$("#city-list").on("click", "button", function() {
    var selectCity = $(this).text();
    console.log(selectCity);
    todaysWeather(selectCity);
    // weeklyWeather(selectCity);

})

var citySelector = function(event) {
    debugger;
    event.preventDefault();

    var cityName = citySearchInputEl.value.trim();


    if (cityName) {
        todaysWeather(cityName);
        // weeklyWeather(cityName);
        var cities = JSON.parse(localStorage.getItem("cities")) || [];

       if (!cities.includes(cityName)) {
       cities.push(cityName);
       console.log(cities);
       localStorage.setItem("cities", JSON.stringify(cities));
       displayCities();  
       }
    } else {
        alert("Please enter a city name");
    }
}

var todaysWeather = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayTodaysWeather(data);
            })
        }
    });
}

function displayTodaysWeather (weatherData) {
    var [month, date, year] = ( new Date() ).toLocaleDateString().split("/");
    console.log(weatherData);
    console.log(month + "/" + date + "/" + year);
    todaysWeatherEl.textContent = "";

    var titleEl = document.createElement("h2")
    titleEl.textContent = weatherData.name + " (" + month + "/" + date + "/" + year + ")";
    var iconEl = document.createElement("i");
    iconEl = 

    todaysWeatherEl.appendChild(titleEl);
    
  
}






displayCities();

citySearchFormEl.addEventListener("submit", citySelector);
