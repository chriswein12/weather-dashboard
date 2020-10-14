var apiKey = "2e1d35c035f3e53a227b30889160b667";

// Variables for page elements
var citySearchFormEl = document.querySelector("#city-search-form");
var citySearchInputEl = document.querySelector("#search-input");
var citySearchBtnEl = document.querySelector("#search-button");
var historyEl = document.querySelector("#city-list");
var todaysWeatherEl = document.querySelector("#todays-weather");
var weeklyWeatherEl = document.querySelector("#weekly-weather");

// Function used to display the search history, up to 10 cities
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

// jQuery function used to make search history clickable
$("#city-list").on("click", "button", function() {
    var selectCity = $(this).text();
    console.log(selectCity);
    todaysWeather(selectCity);
    weeklyWeather(selectCity);
})

// function to enter in a city name into the search
var citySelector = function(event) {
    event.preventDefault();

    var cityName = citySearchInputEl.value.trim();

    // checks if a city name has been entered
    if (cityName) {
        var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
        // this fetch is just for checking to see if we get a valid response from the api before continuing.
        fetch(apiUrl).then(function(response) {
            if (response.ok) {

                // if reponse is okay, the two main functions are called and the search is saved to local storage
                todaysWeather(cityName);
                weeklyWeather(cityName);

                var cities = JSON.parse(localStorage.getItem("cities")) || [];

                if (!cities.includes(cityName)) {
                cities.push(cityName);
                console.log(cities);
                localStorage.setItem("cities", JSON.stringify(cities));
                displayCities();  
                }
            } else {
                alert("Unable to obtain weather for that city. Please check spelling of city.");
            }
        })
        .catch(function(error) {
            alert("Unable to connect to weather service at this time")
        });
    } else {
        alert("Please enter a city name");
    }
}

// first main function to pull up todays weather using the openweathermap API
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

// function to display today's weather once data is received
function displayTodaysWeather (weatherData) {
    todaysWeatherEl.classList = "border border-dark p-2 rounded-lg"
    var [month, date, year] = ( new Date() ).toLocaleDateString().split("/");
    console.log(weatherData);
    console.log(month + "/" + date + "/" + year);
    todaysWeatherEl.textContent = "";

    var lat = weatherData.coord.lat
    var lon = weatherData.coord.lon

    // creating date
    var titleEl = document.createElement("h2");
    titleEl.textContent = weatherData.name + " (" + month + "/" + date + "/" + year + ")";
    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png")

    // creating temp
    var temperatureEl = document.createElement("p");
    temperatureEl.textContent = "Temperature: " + Math.round(weatherData.main.temp) + " °F"

    // creating humidity
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + weatherData.main.humidity + "%";

    // creating windspeed
    var windSpeedEl = document.createElement("p");
    windSpeedEl.textContent = "Wind Speed: " + Math.round(weatherData.wind.speed) + " MPH";

    // appending data
    titleEl.append(iconEl);
    todaysWeatherEl.appendChild(titleEl);
    todaysWeatherEl.appendChild(temperatureEl);
    todaysWeatherEl.appendChild(humidityEl);
    todaysWeatherEl.appendChild(windSpeedEl);

    // function to display UV Index
    var uvData = function(data) {
        console.log(data.value);

        var uvIndexEl = document.createElement("p");
        if (data.value <= 2) {
            uvIndexEl.innerHTML = "UV Index: " + "<span class='text-white bg-success rounded lg p-1'>" + data.value + "</span>";
        } 
        else if (data.value <= 5) {
            uvIndexEl.innerHTML = "UV Index: " + "<span class='text-white bg-warning rounded-lg p-1'>" + data.value + "</span>";
        }
        else {
            uvIndexEl.innerHTML = "UV Index: " + "<span class='text-white bg-danger rounded-lg p-1'>" + data.value + "</span>";
        }
    
        todaysWeatherEl.appendChild(uvIndexEl);
    }
    
    // fetch to receive UV Index data
    fetch("https://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&appid="+apiKey)
    .then(function(response){
        response.json().then(function(data) {
            uvData(data);
        }); 
    }); 
}

// second main function to pull 5 day forecast info
var weeklyWeather = function(city) {
   var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayWeeklyWeather(data);
            })
        }
    });
}

// function to display 5 day forecast
function displayWeeklyWeather (weeklyData) {
    console.log(weeklyData);

    weeklyWeatherEl.textContent = "";

    var weeklyHeaderEl = document.createElement("h3");
    weeklyHeaderEl.className = "p-2";
    weeklyHeaderEl.textContent = "5-Day Forecast:";
    weeklyWeatherEl.appendChild(weeklyHeaderEl);

    var weeklyCardHolderEl = document.createElement("div")
    weeklyCardHolderEl.className = "row";

    for (var i = 0; i < weeklyData.list.length; i++) {

        if (weeklyData.list[i].dt_txt.indexOf("18:00:00") !== -1) {

            var weeklyColEl = document.createElement("div");
            weeklyColEl.classList = "col-auto"

            var weeklyCardEl = document.createElement("div");
            weeklyCardEl.classList = "col-auto mb-4 card bg-primary text-white justify";

            var weeklyDateEl = document.createElement("h5");
            weeklyDateEl.classList = "card-title"
            weeklyDateEl.textContent = moment.unix(weeklyData.list[i].dt).utc().format("MM/DD/YYYY");
            console.log(weeklyDateEl);

            var weeklyIconEl = document.createElement("img");
            weeklyIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weeklyData.list[i].weather[0].icon + "@2x.png");

            var weeklyTempEl = document.createElement("p");
            weeklyTempEl.textContent = "Temp: " + Math.round(weeklyData.list[i].main.temp) + " °F"

            var weeklyHumidityEl = document.createElement("p");
            weeklyHumidityEl.textContent = "Humidity: " + weeklyData.list[i].main.humidity + "%";
            console.log(weeklyHumidityEl);

            weeklyCardEl.appendChild(weeklyDateEl);
            weeklyCardEl.appendChild(weeklyDateEl);
            weeklyCardEl.appendChild(weeklyIconEl);
            weeklyCardEl.appendChild(weeklyTempEl);
            weeklyCardEl.appendChild(weeklyHumidityEl);
            weeklyColEl.appendChild(weeklyCardEl);
            weeklyCardHolderEl.appendChild(weeklyColEl);
        }
    }
    weeklyWeatherEl.appendChild(weeklyCardHolderEl);
}

displayCities();

citySearchFormEl.addEventListener("submit", citySelector);
