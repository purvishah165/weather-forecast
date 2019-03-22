# Weather Widget
This is a React.Js project built to display a simple weather widget.

This project is a weather application that calls the OpenWeatherMap API to render the weather of the location (only located in Australia) and day selected by the user.
1. It displays weather of the current location of the user by default.
2. User can enter the city of choice to get the weather forecast.
3. A 5 day forecast is displayed depending on the city chosen.

API call:
api.openweathermap.org/data/2.5/forecast?q={city name},{country code}
Parameters:
q city name and country code divided by comma
Here country code is AU by default

Also used the following API for displaying the weather forecast for the current location of the user.
api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}

## Pre-requisites

* Node.js 9.8.0 and above

## Installation

* git clone
* npm install
* npm start

It will run on localhost:3000/weather for current location.
To see weather forecast for a specific 'city': localhost:3000/weather/city
To see weather for the city on a particular day eg : localhost:/3000/weather/Sydney/Tuesday

## Unit tests

* uses jest and enzyme
  npm test - to run all the test cases

##Tech Stack
* React.js
* JavaScript (ES6)
* HTML5
* Jest + Enzyme