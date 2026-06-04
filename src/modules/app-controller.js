import Weather from "./weather.js"

const appController = (() => {
    const API_KEY = "3MJPHZNPHSSEU77B7SWV5NUMW";
    const defaultWeather = null;
    let currentWeather = defaultWeather;

    async function fetchWeather(location) {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`;
        try {
            const response = await fetch(url);
            if (!response.ok)
                throw new Error ("weather-fetch failed!");

            const data = await response.json();
            console.log(data);
            return data;
        }
        catch (error) {
            console.log(error);
        }
    }

    async function processWeatherData(weatherData) {
        const data = await weatherData;

        const location = data.resolvedAddress;
        const temperature = {
            current: data.currentConditions.temp,
            feelsLike: data.currentConditions.feelslike,
            min: data.days[0].tempmin,
            max: data.days[0].tempmax
        };
        const atmosphere = {
            humidity: data.currentConditions.humidity,
            pressure: data.currentConditions.pressure,
            uvIndex: data.currentConditions.uvindex
        };
        const wind = {
            speed: data.currentConditions.windspeed,
            gust: data.currentConditions.windgust
        };
        const sun = {
            sunrise: data.currentConditions.sunrise,
            sunset: data.currentConditions.sunset
        };
        const precipitation = {
            precipType: data.currentConditions.preciptype,
            precipProb: data.currentConditions.precipprob,
            precip: data.currentConditions.precip
        };

        const condition = data.currentConditions.conditions;
        const icon = data.currentConditions.icon;
        const desc = data.days[0].description;

        const weather = new Weather(location, temperature, atmosphere, wind, sun, precipitation, condition, icon, desc);
        currentWeather = weather;
        console.log(currentWeather);
    }

    return {fetchWeather, processWeatherData};
})();

export default appController;