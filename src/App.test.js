import React from 'react';
import { shallow, mount } from 'enzyme';
import App, { Weather } from './App';
import { MemoryRouter
} from 'react-router'
import { Route } from 'react-router-dom';

let pathMap = {};
describe('routes using array of routers', () => {
    beforeAll(() => {
        const component = shallow(<App/>);
        pathMap = component.find(Route).reduce((pathMap, route) => {
            const routeProps = route.props();
            pathMap[routeProps.path] = routeProps.component;
            return pathMap;
        }, {});
        console.log(pathMap)
    })
    it('should show Weather component for /weather', () => {

        expect(pathMap['/weather']).toBe(Weather);
    })
    it('should show Weather component for /weather/Sydney', () => {

        expect(pathMap['/weather/Sydney']).toBe(Weather);
    })
    it('should show Weather component for /weather/Sydney/Monday', () => {

        expect(pathMap['/weather/Sydney/Monday']).toBe(Weather);
    })
    it('default should be weather component', () => {

        expect(pathMap['/']).toBe(Weather);
    })
})
