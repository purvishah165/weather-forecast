import React from "react";
import Forecast from "../forecastComponent/forecast";
import './weather.css';
const Api_Key = "8d2de98e089f1c28e1a22fc19a24ef04";

class Weather extends React.Component {
    state = {
        lat: undefined,
        lon: undefined,
        city_name: undefined,
        weatherData: undefined,
        loading: false,
        day: undefined,
        date: new Date(),
        days: []
    };
    render() {
        return (
            <div className="wrapper">
                <form className="location-form" onSubmit={this.getWeather}>
                    <label htmlFor="location">Enter your location: </label>
                    <input id="location"
                           name="location"
                           onChange={this.handleLocationChange}></input>
                    <button onClick={this.getWeather} type="button">Get weather data</button>
                    {
                        this.state.error && <span className="weather-error">{this.state.error}</span>
                    }
                </form>
                {
                    !this.state.loading &&
                    <div className="main">
                        {
                            this.state.weatherData && <Forecast
                                day={this.state.day}
                                location={this.state.location}
                                weatherData={this.state.weatherData}
                            />
                        }
                        <div className="days">
                            {
                                this.state.days.map(day =>
                                    <button onClick={() => this.selectDate(day.date)} key={day.label}
                                            disabled={day.date.toDateString() === this.state.date.toDateString()}>
                                        <div>
                                            {
                                                <img alt="Weather icon" src={'http://openweathermap.org/img/w/' + day.weatherData.weather[0].icon + '.png'}></img>
                                            }
                                        </div>
                                        {day.label}</button>
                                )
                            }
                        </div>
                    </div>
                }
                {this.state.loading &&
                    <div className="loader cover-spin">
                    </div>
                }
            </div>
        )
    }
    componentDidMount() {
        new Promise(function (resolve, reject) {
            window.navigator.geolocation.getCurrentPosition(resolve, reject);
        }).then((position)=> {
            this.setState({
                lat: position.coords.latitude,
                lon: position.coords.longitude
            });

            if (this.props.match.params && this.props.match.params.location) {
                this.fetchWeather(this.props.match.params.location);
            } else {
                this.fetchWeather();
            }
        })
            .catch((error) => {
                console.log(error)
            });
    }

    handleLocationChange = (e) => {
        this.setState({ city_name: e.target.value });
    };
    getWeather = (e) => {
        e.preventDefault();
        this.props.history.push(`/weather/${this.state.city_name ? this.state.city_name : ''}`);
        this.fetchWeather(this.state.city_name);
    };

    selectDate = (selectedDate) => {
        const dayLabel = (new Date()).toDateString() === selectedDate.toDateString() ? 'Today' : Weather.dayLabel(selectedDate.getDay());
        this.props.history.push(`/weather/${this.state.location}/${dayLabel}`);
        this.setState({
            date: selectedDate,
            day: dayLabel,
            weatherData: this.getWeatherForDate(this.state.days, selectedDate),
        });
    };

    getWeatherForDate = (days, selectedDate) => {
        let weatherInfo = {};
        days.forEach(daysData => {
            if (selectedDate.toDateString() === daysData.date.toDateString()) {
                weatherInfo = daysData.weatherData;
            }
        });
        return weatherInfo;
    };
    fetchWeather = (city_name) => {
        this.setState({
            loading: true,
            date: new Date()
        });
        let api_url ='http://api.openweathermap.org/data/2.5/forecast?units=metric&appid=' + Api_Key;
        if (city_name) {
            api_url += '&q=' + city_name + ',AU'; // Assume country to be Australia
        } else if (this.state.lat && this.state.lon) {
            api_url += '&lat=' + this.state.lat;
            api_url += '&lon=' + this.state.lon;
        }
        fetch(api_url)
            .then((resp) => {
                let json = resp.json();
                if (resp.status >= 200 && resp.status < 300) {
                    return json;
                } else {
                    return json.then(Promise.reject.bind(Promise));
                }
            })
            .then(this.setWeatherData)
            .catch(response => {
                this.setState({ error: response.message });
            })
            .finally(() => {
                this.setState( {
                    loading: false
                });
            });
    };
    setWeatherData = (response) => {
        const days = [];
        let date = this.state.date;
        const paramsDay = this.props.match.params.weekday;
        let weatherInfo;
        response.list.forEach(dayWeather => {
            const date = new Date(dayWeather.dt_txt);
            const label = Weather.dayLabel(date.getDay());
            if (!days.some(day => day.label === label)) {
                const dt_day = {
                    date: new Date(dayWeather.dt_txt),
                    label: label,
                    weatherData: dayWeather
                };
                days.push(dt_day);
            }
        });
        if (paramsDay) {
            if (paramsDay.toLowerCase() === 'today') {
                date = new Date();
            } else {
                days.forEach(day => {
                    if (day.label.toLowerCase() === paramsDay.toLowerCase()) {
                        date = day.date;
                    }
                })
            }
        }

        weatherInfo = this.getWeatherForDate(days, date);
        const dayLabel = (new Date()).toDateString() === date.toDateString() ? 'Today' : Weather.dayLabel(date.getDay());
        this.setState({
            date: date,
            day: dayLabel,
            days: days,
            weatherData: weatherInfo,
            location: response.city.name,
            locationWeather: response.list,
            error: ''
        });
    };

    static dayLabel(day) {
        switch(day) {
            case 0:
                return 'Sunday';
            case 1:
                return 'Monday';
            case 2:
                return 'Tuesday';
            case 3:
                return 'Wednesday';
            case 4:
                return 'Thursday';
            case 5:
                return 'Friday';
            case 6:
                return 'Saturday';
            default:
                return '';
        }
    }
}
export default Weather;
