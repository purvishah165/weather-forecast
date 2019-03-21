import React from 'react';
import Weather from './weather';
import { mount} from 'enzyme'

let container, day, location, weatherData;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    day = 'Today';
    location = 'Croydon';
    weatherData = {
        main: {
            temp: 23
        },
        weather: [{
            icon: 'p10'
        }]
    }
    const mockGeoLocation = {
        getCurrentPosition: jest.fn()
            .mockImplementationOnce((success) => Promise.resolve(success({
                coords: {
                    latitude: 51.1,
                    longitude: 45.3
                }
            })))
    };

    global.navigator.geolocation = mockGeoLocation;
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

function buildComponent() {
    return mount(<Weather
    />, container);
}

it('renders without crashing', () => {
    buildComponent();
});

it('should get the current geo coordinates for default location', async () => {
    const component = await buildComponent();
    expect(global.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    expect(component.state().lat).toEqual(51.1)
    expect(component.state().lon).toEqual(45.3)
});
