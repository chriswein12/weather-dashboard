var apiKey = "2e1d35c035f3e53a227b30889160b667";
var cities = [];

var citySearchFormEl = document.querySelector("#city-search-form")
var citySearchInputEl = document.querySelector("#search-input");
var citySearchBtnEl = document.querySelector("#search");

var citySelector = function(event) {
    event.preventDefault();

    var cityName = citySearchInputEl.value.trim();

    if (cityName) {
        console.log(cityName);
    }
}






citySearchFormEl.addEventListener("submit", citySelector);
