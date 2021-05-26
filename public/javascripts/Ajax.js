
document.getElementById("edit-logo").onclick = function () {
    location.href = "/preferences";
};

var days = ['Sunday','Monday','Tuesday','Wed','Thur','Friday','Sat'];

var months = ['Jan','Feb','March','April','May','June','July','Aug','Sep','Oct','Nov','Dec'];

var d = new Date();
var curr_day = d.getDay();
var curr_date = d.getDate();
var curr_month = d.getMonth();
var curr_year = d.getFullYear();

var date = months[curr_month] + " " + curr_date + ", " + curr_year;

// display date and day on weather div
document.getElementById("date-time").innerHTML = '<p class="day">' + days[curr_day] + '</p>' +
                                                 '<p class="date">' + date + '</p>';


// my weather-div is purely working through AJAX
function callAPI(){
  const weatherApiKey = document.getElementById("api-key").value;
  const cityName = document.getElementById("cityInput").value;

  // here I am doing Ajax call
  // AJAX allows web pages to be updated asynchronously by exchanging data with a web server behind the scenes.
  // This means that it is possible to update parts of a web page, without reloading the whole page.

  // this is the method of fetching data through AJAX calls
  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + weatherApiKey + "&units=metric")
  .then((data) => {
      return data.json();
  })
  .then((weatherData) => {
     const imageURL =  "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";

     document.getElementById("weather-response").innerHTML = '<p class="weather-desc">' + weatherData.weather[0].description + '</p>' +
                                                              '<img class="weather-icon" src=' + imageURL + '>' +
                                                              '<h1 class="temp">' + weatherData.main.temp + '°c </h1>'

  })
  .catch((err) => {
    // if user enters a invalid city then display error on the div
     document.getElementById("weather-response").innerHTML = '<p>'+ "Please enter a valid city name" + '</p>';
  });
}


// when user presses ENTER key then I am calling my API
document.getElementById("cityInput").addEventListener("keydown", function (e) {
      if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
          callAPI();
      }
});

// or when user clicks on GO button then I am calling the API
document.getElementById("city-submit").addEventListener("click", function(){
      callAPI();
});
