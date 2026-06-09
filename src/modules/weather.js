import {parse, format} from "date-fns";

export default class Weather {
    constructor (location, temperature, atmosphere, wind, sun, precipitation, condition, icon, desc) {
        this.location = location.charAt(0).toUpperCase() + location.slice(1);
        this.temperature = {
            current: temperature.current,
            feelsLike: temperature.feelsLike,
            min: temperature.min,
            max: temperature.max
        };
        this.atmosphere = {
            humidity: atmosphere.humidity,
            pressure: atmosphere.pressure,
            uvIndex: atmosphere.uvIndex
        };
        this.wind = {
            speed: wind.speed,
            gust: wind.gust
        };
        const sunriseDate = parse(sun.sunrise, "HH:mm:ss", new Date());
        const sunriseString = format(sunriseDate, "hh:mm a");
        const sunsetDate = parse(sun.sunset, "HH:mm:ss", new Date());
        const sunsetString = format(sunsetDate, "hh:mm a");
        this.sun = {
            sunrise: sunriseString,
            sunset: sunsetString
        };
        this.precipitation = {
            precipType: precipitation.precipType,
            precipProb: precipitation.precipProb,
            precip: precipitation.precip
        };

        this.condition = condition;
        this.icon = icon;
        this.description = desc;
    }
}