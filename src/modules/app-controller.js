const appController = (() => {
    const API_KEY = "3MJPHZNPHSSEU77B7SWV5NUMW";
    // const defaultWeather;
    // let currentWeather = defaultWeather;

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

    return {fetchWeather};
})();

export default appController;