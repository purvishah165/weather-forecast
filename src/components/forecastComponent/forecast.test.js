import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Forecast from './forecast';

let container, day, location, weatherData;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    day = 'Today';
    location = 'Croydon';
    weatherData = {
        main: {
            temp: 123
        },
        weather: [{
            icon: 'p10'
        }]
    }
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

function buildComponent() {
    act(() => {
        ReactDOM.render(<Forecast
            day={day}
            location={location}
            weatherData={weatherData}
        />, container);
    });
}

it('renders without crashing', () => {
    buildComponent();

});
