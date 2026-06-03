export default class Weather {

    constructor (location, temperature, atmosphere, wind, sun, precipitation, condition, icon) {
        this.location = location;

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
        this.sun = {
            sunrise: sun.sunrise,
            sunset: sun.sunset
        };

        this.precipitation = precipitation;
        this.condition = condition;
        this.icon = icon;
    }
}