import React from "react";
import Forecast from "./forecast";
import { mount } from "enzyme";

let container, day, location, weatherData;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  day = "Today";
  location = "Croydon";
  weatherData = {
    main: {
      temp: 23
    },
    weather: [
      {
        icon: "p10"
      }
    ]
  };
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

function buildComponent() {
  return mount(
    <Forecast day={day} location={location} weatherData={weatherData} />,
    container
  );
}

it("renders without crashing", () => {
  buildComponent();
});

it("shows the city name", () => {
  expect(
    buildComponent()
      .find(".weather-location")
      .text()
  ).toContain("Croydon");
});

it("shows the day info", () => {
  expect(
    buildComponent()
      .find(".day-info")
      .text()
  ).toContain("Today");
});

it("shows the temperature", () => {
  expect(
    buildComponent()
      .find(".temperature-value")
      .text()
  ).toContain("23" + String.fromCharCode(176));
});

it("shows the weather icon", () => {
  expect(
    buildComponent().find(
      '.weather-img img[src="http://openweathermap.org/img/w/p10.png"]'
    ).length
  ).toBe(1);
});
