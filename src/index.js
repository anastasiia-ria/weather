import $ from "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";

$(document).ready(function () {
  let location = "";
  let day;
  $("#weatherLocation").click(function () {
    const city = capitalize($("#city").val());
    const state = capitalize($("option:selected").val());

    location = "";
    if (city !== "") {
      location = city;
      if (state !== "") {
        location += "," + state;
      }
    } else {
      location = state;
    }
    $("#city").val("");

    let request = new XMLHttpRequest();
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.API_KEY}`;

    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.responseText);
        getElements(response);
      }
    };

    request.open("GET", url, true);
    request.send();

    function capitalize(string) {
      let array = string.split(" ");

      for (let i = 0; i < array.length; i++) {
        array[i] = array[i].substr(0, 1).toUpperCase() + array[i].substr(1);
      }
      return array.join(" ");
    }

    function getTime(date) {
      let hours = date.getHours();
      const minutes = "0" + date.getMinutes();
      const ampm = hours > 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12;
      return hours + ":" + minutes.substr(-2) + " " + ampm;
    }

    function getElements(response) {
      const kelvinT = response.main.temp;
      const fahrT = Math.round(((kelvinT - 273.15) * 9) / 5 + 32);
      $(".showHumidity").text(`The humidity in ${location} is ${response.main.humidity}%`);
      $(".showTemp").text(`The temperature in Fahrenheit is ${fahrT} degrees.`);
      $("ul.showWeather").empty();
      response.weather.forEach((elem) => {
        const iconCode = elem.icon;
        const iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
        $("ul.showWeather").append(`<li><img src=${iconUrl}> ${elem.main} : ${elem.description} </li>`);
      });

      const sunRiseUnix = response.sys.sunrise;
      const sunSetUnix = response.sys.sunset;
      const sunRiseDate = new Date(sunRiseUnix * 1000);
      const sunSetDate = new Date(sunSetUnix * 1000);
      day = sunRiseDate.getDay();

      $(".sunrise").html("Sunrise time: " + getTime(sunRiseDate));
      $(".sunset").html("Sunset time: " + getTime(sunSetDate));

      $("#forecast").show();
    }
  });

  $("#forecast").click(function () {
    let request = new XMLHttpRequest();
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.API_KEY}`;

    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.responseText);
        getForecast(response);
      }
    };

    request.open("GET", url, true);
    request.send();

    $("#forecast-table > ul:not(:first-child)").empty();

    function getForecast(response) {
      const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      for (let i = 0; i < 8; i++) {
        let dayNum = i + 1;
        $("ul#day-" + dayNum).append(`<li class="brdr">${weekDays[day + i]}</li>`);
      }
      /*
      n =calcEmptyLis();

      for ()
        -creates n li elements at beginning of first day


      */
      let n = 5;
      let today = new Date();
      let hour = today.getHours();

      if (hour >= 0 && hour < 3) {
        n = 0;
      } else if (hour >= 3 && hour < 6) {
        n = 1;
      } else if (hour >= 6 && hour < 9) {
        n = 2;
      } else if (hour >= 9 && hour < 12) {
        n = 3;
      } else if (hour >= 12 && hour < 15) {
        n = 4;
      } else if (hour >= 15 && hour < 18) {
        n = 5;
      } else if (hour >= 18 && hour < 21) {
        n = 6;
      } else if (hour >= 21 && hour < 24) {
        n = 7;
      }

      for (let i = 0; i < n; i++) {
        $("ul#day-1").append(`<li class="dummy"></li>`);
      }

      for (let i = 0; i < 40; i++) {
        const kelvinT = response.list[i].main.temp;
        const fahrT = Math.round(((kelvinT - 273.15) * 9) / 5 + 32);

        const iconCode = response.list[i].weather[0].icon;
        const iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
        if (i >= 0 && i < 8 - n) {
          $("ul#day-1").append(`<li><img src=${iconUrl}></li>`);
          $("ul#day-1").append(`<li class="brdr">${fahrT}??</li>`);
        } else if (i >= 8 - n && i < 16 - n) {
          $("ul#day-2").append(`<li><img src=${iconUrl}></li>`);
          $("ul#day-2").append(`<li class="brdr">${fahrT}??</li>`);
        } else if (i >= 16 - n && i < 24 - n) {
          $("ul#day-3").append(`<li><img src=${iconUrl}></li>`);
          $("ul#day-3").append(`<li class="brdr">${fahrT}??</li>`);
        } else if (i >= 24 - n && i < 32 - n) {
          $("ul#day-4").append(`<li><img src=${iconUrl}></li>`);
          $("ul#day-4").append(`<li class="brdr">${fahrT}??</li>`);
        } else if (i >= 32 - n && i < 40 - n) {
          $("ul#day-5").append(`<li><img src=${iconUrl}></li>`);
          $("ul#day-5").append(`<li class="brdr">${fahrT}??</li>`);
        }
      }
    }
    $("#forecast-box").show();
  });
});
