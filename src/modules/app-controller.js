import { parseISO, format} from "date-fns";

import Weather from "./weather.js";
import MiniWeather from "./mini-weather.js";

/**
 * Fetches weather from Visual Crossing, maps API JSON into model instances,
 * and stores current weather, weekly forecast, and unit preference.
 */
const appController = (() => {
    const API_KEY = "3MJPHZNPHSSEU77B7SWV5NUMW";
    let currentWeather = null;
    let currentUnit = "F";
    let weeklyForcast = [];

    /** @returns {Weather|null} */
    function getCurrentWeather() {
        return currentWeather;
    }

    /**
     * @param {string} location - city or country search string
     * @returns {Promise<object>} raw Visual Crossing timeline JSON
     */
    async function fetchWeather(location) {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`;
            
        const response = await fetch(url);
        if (!response.ok)
            throw new Error ("Bad input: weather-fetch failed!");

        const data = await response.json();
        return data;
    }

    /**
     * Map API JSON into a Weather instance for the current dashboard.
     * @param {object} data - raw Visual Crossing timeline response
     */
    function processWeatherData(data) {
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
    }

    /**
     * Convert °F to °C for display.
     * @param {number} temperature - value in Fahrenheit
     * @returns {number}
     */
    function convertToCelcius(temperature) {
        const celcius = ((temperature-32)*5)/9;
        return Math.round(celcius*10)/10; 
    }

    /** @returns {"C"|"F"} */
    function getCurrentUnit() {
        return currentUnit;
    }

    function setCelcius() {
        currentUnit = "C";
    }

    function setFarenhite() {
        currentUnit = "F";
    }

    /**
     * Build MiniWeather entries from days[1]–days[7] (tomorrow onward).
     * Skips missing days if the API returns a shorter timeline.
     * @param {object} data - raw Visual Crossing timeline response
     */
    function processWeeklyForcast(data) {
        weeklyForcast = [];

        for (let i = 1; i <= 7; i++) {
            const dayData = data.days[i];
            if (!dayData)
                continue;

            let day;
            if (i === 1)
                day = "Tomorrow";
            else {
                const date = parseISO(dayData.datetime);
                day = format(date, "EEE");
            }

            const miniWeather = new MiniWeather(
                day,
                dayData.tempmin,
                dayData.tempmax,
                dayData.icon,
                dayData.conditions
            );
            weeklyForcast.push(miniWeather);
        }
    }

    /** @returns {MiniWeather[]} copy of the weekly forecast array */
    function getWeeklyForcast() {
        return [...weeklyForcast];
    }

    return {fetchWeather, processWeatherData, getCurrentWeather, convertToCelcius, getCurrentUnit, setCelcius, setFarenhite, processWeeklyForcast, getWeeklyForcast};
})();

export default appController;
