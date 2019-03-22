import React from "react";
import Weather from "./weather";
import { mount } from "enzyme";

let container, props;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn().mockImplementationOnce(success =>
      Promise.resolve(
        success({
          coords: {
            latitude: 51.1,
            longitude: 45.3
          }
        })
      )
    )
  };
  props = {
    match: {
      params: {}
    },
    history: []
  };
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

function buildComponent() {
  return mount(<Weather {...props} />, container);
}

it("renders without crashing", () => {
  buildComponent();
});

it("should get the current geo coordinates for default location", async done => {
  const weatherData = {
    clouds: { all: 92 },
    dt_txt: "2019-03-22 12:00:00",
    main: { temp: 20.43, temp_min: 20.43, temp_max: 21.51 },
    weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10n" }]
  };
  const mockFetchPromise = Promise.resolve({
    json: () =>
      Promise.resolve({
        list: [weatherData],
        city: {
          name: "Croydon"
        }
      }),
    status: 200
  });
  jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);

  const component = await buildComponent();
  expect(global.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
  expect(component.state().lat).toEqual(51.1);
  expect(component.state().lon).toEqual(45.3);

  expect(global.fetch).toHaveBeenCalledWith(
    "http://api.openweathermap.org/data/2.5/forecast" +
      "?units=metric" +
      "&appid=8d2de98e089f1c28e1a22fc19a24ef04" +
      "&lat=51.1" +
      "&lon=45.3"
  );

  process.nextTick(() => {
    expect(component.state().day).toEqual("Today");
    expect(component.state().location).toEqual("Croydon");
    expect(component.state().weatherData).toEqual(weatherData);

    global.fetch.mockClear();
    done();
  });
});

it("should get the weather for city name if set in params", async done => {
  const weatherData = {
    clouds: { all: 92 },
    dt_txt: "2019-03-22 12:00:00",
    main: { temp: 20.43, temp_min: 20.43, temp_max: 21.51 },
    weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10n" }]
  };
  const mockFetchPromise = Promise.resolve({
    json: () =>
      Promise.resolve({
        list: [weatherData],
        city: {
          name: "Croydon"
        }
      }),
    status: 200
  });
  jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);

  props.match.params = {
    location: "Croydon"
  };
  const component = await buildComponent();

  expect(global.fetch).toHaveBeenCalledWith(
    "http://api.openweathermap.org/data/2.5/forecast" +
      "?units=metric" +
      "&appid=8d2de98e089f1c28e1a22fc19a24ef04" +
      "&q=Croydon,AU"
  );

  process.nextTick(() => {
    expect(component.state().day).toEqual("Today");
    expect(component.state().location).toEqual("Croydon");
    expect(component.state().weatherData).toEqual(weatherData);

    global.fetch.mockClear();
    done();
  });
});

it("should get the weather for city name and day if set in params", async done => {
  const fixedDate = new Date("2019-03-22");
  const originalDate = Date;
  // mock the date to return new Date as a fixed date 22-03-2019
  Date = class extends Date {
    constructor() {
      super();

      return fixedDate;
    }
  };
  const mondayWeatherData = {
    clouds: { all: 92 },
    dt_txt: "2019-03-18 12:00:00",
    main: { temp: 20.43, temp_min: 20.43, temp_max: 21.51 },
    weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10n" }]
  };
  const thursdayWeatherData = {
    clouds: { all: 92 },
    dt_txt: "2019-03-22 12:00:00",
    main: { temp: 20.43, temp_min: 20.43, temp_max: 21.51 },
    weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10n" }]
  };
  const mockFetchPromise = Promise.resolve({
    json: () =>
      Promise.resolve({
        list: [mondayWeatherData, thursdayWeatherData],
        city: {
          name: "Croydon"
        }
      }),
    status: 200
  });
  jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);

  props.match.params = {
    location: "Croydon",
    weekday: "Monday"
  };
  const component = await buildComponent();

  expect(global.fetch).toHaveBeenCalledWith(
    "http://api.openweathermap.org/data/2.5/forecast" +
      "?units=metric" +
      "&appid=8d2de98e089f1c28e1a22fc19a24ef04" +
      "&q=Croydon,AU"
  );

  process.nextTick(() => {
    expect(component.state().day).toEqual("Monday");
    expect(component.state().location).toEqual("Croydon");
    expect(component.state().weatherData).toEqual(mondayWeatherData);

    global.fetch.mockClear();
    done();
  });

  Date = originalDate;
});

describe("after initial load", () => {
  let component, thursdayWeatherData, mondayWeatherData;
  beforeEach(async () => {
    thursdayWeatherData = {
      clouds: { all: 92 },
      dt_txt: "2019-03-22 12:00:00",
      main: { temp: 20.43, temp_min: 20.43, temp_max: 21.51 },
      weather: [
        { id: 500, main: "Rain", description: "light rain", icon: "10n" }
      ]
    };
    mondayWeatherData = {
      clouds: { all: 92 },
      dt_txt: "2019-03-18 12:00:00",
      main: { temp: 20.43, temp_min: 20.43, temp_max: 21.51 },
      weather: [
        { id: 500, main: "Rain", description: "light rain", icon: "10n" }
      ]
    };
    const mockFetchPromise = Promise.resolve({
      json: () =>
        Promise.resolve({
          list: [thursdayWeatherData],
          city: {
            name: "Croydon"
          }
        }),
      status: 200
    });
    jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);

    component = await buildComponent();
    process.nextTick(() => {});
  });

  it("should get the weather for city name entered in the input form", done => {
    component
      .find("input#location")
      .simulate("change", { target: { value: "Croydon" } });
    component.find(".location-form button").simulate("click");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://api.openweathermap.org/data/2.5/forecast" +
        "?units=metric" +
        "&appid=8d2de98e089f1c28e1a22fc19a24ef04" +
        "&q=Croydon,AU"
    );

    process.nextTick(() => {
      expect(component.state().day).toEqual("Today");
      expect(component.state().location).toEqual("Croydon");
      expect(component.state().weatherData).toEqual(thursdayWeatherData);

      global.fetch.mockClear();
      done();
    });
  });
});
