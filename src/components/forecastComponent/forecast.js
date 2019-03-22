import React from "react";
import "./forecast.css";

class Forecast extends React.Component {
  render() {
    return (
        <div className="weather-info">
          <div className="day-info">{this.props.day}</div>
          <div className="weather-data">
            <div className="weather-img">
              {this.props.weatherData.weather[0].icon && (
                  <img
                      alt="Weather icon"
                      src={
                  "http://openweathermap.org/img/w/" +
                  this.props.weatherData.weather[0].icon +
                  ".png"
                }
                      />
              )}
            </div>
            <div className="weather-container">
              {this.props.location && (
                  <span className="weather-location">{this.props.location}</span>
              )}

              {this.props.weatherData.main.temp && (
                  <h2 className="temperature-value">
                    {this.props.weatherData.main.temp}&#176;
                  </h2>
              )}
            </div>
          </div>
        </div>
    );
  }
};


export default Forecast;
