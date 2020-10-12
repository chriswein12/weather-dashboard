var apiKey = "2e1d35c035f3e53a227b30889160b667";

var citySearchFormEl = document.querySelector("#city-search-form");
var citySearchInputEl = document.querySelector("#search-input");
var citySearchBtnEl = document.querySelector("#search-button");
var historyEl = document.querySelector("#city-list");
var todaysWeatherEl = document.querySelector("#todays-weather");
var weeklyWeatherEl = document.querySelector("#weekly-weather");

function displayCities() {
    historyEl.textContent = "";

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
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    
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

    var lat = weatherData.coord.lat
    var lon = weatherData.coord.lon

    var titleEl = document.createElement("h2");
    titleEl.textContent = weatherData.name + " (" + month + "/" + date + "/" + year + ")";
    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png")

    var temperatureEl = document.createElement("p");
    temperatureEl.textContent = "Temperature: " + Math.round(weatherData.main.temp) + " °F"

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + weatherData.main.humidity + "%";

    var windSpeedEl = document.createElement("p");
    windSpeedEl.textContent = "Wind Speed: " + Math.round(weatherData.wind.speed) + " MPH";


    titleEl.append(iconEl);
    todaysWeatherEl.appendChild(titleEl);
    todaysWeatherEl.appendChild(temperatureEl);
    todaysWeatherEl.appendChild(humidityEl);
    todaysWeatherEl.appendChild(windSpeedEl);

    var uvData = function(data) {
        console.log(data.value);

        var uvIndexEl = document.createElement("p");
        if (data.value <= 2) {
            uvIndexEl.innerHTML = "UV Index: " + "<span class='text-white bg-success'>" + data.value + "</span>";
        } 
        else if (data.value <= 5) {
            uvIndexEl.innerHTML = "UV Index: " + "<span class='text-white bg-warning'>" + data.value + "</span>";
        }
        else {
            uvIndexEl.innerHTML = "UV Index: " + "<span class='text-white bg-danger'>" + data.value + "</span>";
        }
    
        todaysWeatherEl.appendChild(uvIndexEl);

    }
    
    fetch("http://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&appid="+apiKey)
    .then(function(response){
        response.json().then(function(data) {
            uvData(data);
        }); 
    }); 
}



displayCities();

citySearchFormEl.addEventListener("submit", citySelector);
