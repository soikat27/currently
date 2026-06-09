import { parseISO, format} from "date-fns";

import Weather from "./weather.js";
import MiniWeather from "./mini-weather.js";

const appController = (() => {
    const API_KEY = "3MJPHZNPHSSEU77B7SWV5NUMW";
    let currentWeather = null;
    let currentUnit = "F";
    const weeklyForcast = [];

    function getCurrentWeather() {
        return currentWeather;
    }

    async function fetchWeather(location) {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`;
            
        const response = await fetch(url);
        if (!response.ok)
            throw new Error ("Bad input: weather-fetch failed!");

        const data = await response.json();
        return data;
    }

    function processWeatherData(data) {
        console.log(data);
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

    function convertToCelcius(temperature) {
        const celcius = ((temperature-32)*5)/9;
        return Math.round(celcius*10)/10; 
    }

    function getCurrentUnit() {
        return currentUnit;
    }

    function setCelcius() {
        currentUnit = "C";
    }

    function setFarenhite() {
        currentUnit = "F";
    }

    function fetchWeeklyForcast(data) {
        for (let i = 1; i <= 7; i++) {
            let day;
            if (i === 1)
                day = "Tomorrow";
            else {
                const dateString = data.days[i].datetime;
                const date = parseISO(dateString);
                day = format(date, "EEE");
            }
            const tempMin = data.days[i].tempmin;
            const tempMax = data.days[i].tempmax;
            const icon = data.days[i].icon;
            const miniWeather = new MiniWeather(day, tempMin, tempMax, icon);

            weeklyForcast.push(miniWeather);
        }
    }

    function getWeeklyForcast() {
        return [...weeklyForcast];
    }

    return {fetchWeather, processWeatherData, getCurrentWeather, convertToCelcius, getCurrentUnit, setCelcius, setFarenhite, fetchWeeklyForcast, getWeeklyForcast};
})();

export default appController;