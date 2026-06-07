import AppController from "./app-controller.js"

const uiController = (() => {
    async function fetchWeather(form, location, errorMessageDiv) {
        // clear previous error message
        errorMessageDiv.textContent = "";
        try {
            const data = await AppController.fetchWeather(location);
            AppController.processWeatherData(data);
            const weather = AppController.getCurrentWeather();

            if (weather) {
                developMainSection(weather);
                developMetricsSection(weather);

                showReadyView();
            }
        }
        catch(error) {
            if (error.message === "Bad input: weather-fetch failed!")
                errorMessageDiv.textContent = "Bad input: weather-fetch failed! Please try a valid location input.";
            else
                errorMessageDiv.textContent = "Network error! Please try another time."
        }
        finally {
            form.reset();
        }
    }

    function idleFormHandler(event) {
        event.preventDefault();

        const form = event.currentTarget;
        // validate form-fields
        const searchBar = document.getElementById("location-input-idle");
        validateLocation(searchBar);
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const location = document.getElementById("location-input-idle").value;
        const errorMessageDiv = document.getElementById("search-error-idle");
        fetchWeather(form, location, errorMessageDiv);
    }

    function readyFormHandler(event) {
        event.preventDefault();
        
        const form = event.currentTarget;
        // validate form-fields
        const searchBar = document.getElementById("location-input");
        validateLocation(searchBar);
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const location = document.getElementById("location-input").value;
        const errorMessageDiv = document.getElementById("search-error-ready");
        fetchWeather(form, location, errorMessageDiv);
    }

    function showIdleView() {
        const idleSection = document.getElementById("app-idle");
        const readySection = document.getElementById("app-ready");
        readySection.classList.add("hide");
        idleSection.classList.remove("hide");
    }

    function showReadyView() {
        const idleSection = document.getElementById("app-idle");
        const readySection = document.getElementById("app-ready");
        idleSection.classList.add("hide");
        readySection.classList.remove("hide");
    }

    function developMainSection(weather) {
        const temperature = document.getElementById("temp-current");
        const location = document.getElementById("location");
        const condition = document.getElementById("condition");
        const feelsLike = document.getElementById("temp-feels");
        const description = document.getElementById("description");
        const tempMin = document.getElementById("temp-min");
        const tempMax = document.getElementById("temp-max");

        temperature.textContent = `${weather.temperature.current}°`;
        location.textContent = weather.location;
        condition.textContent = weather.condition;
        feelsLike.textContent = `Feels like ${weather.temperature.feelsLike}°`;
        description.textContent = weather.description;
        tempMin.textContent = `${weather.temperature.min}°`;
        tempMax.textContent = `${weather.temperature.max}°`;
    }

    function developMetricsSection(weather) {
        const humidity = document.getElementById("humidity");
        const pressure = document.getElementById("pressure");
        const uvIndex = document.getElementById("uv-index");
        const wind = document.getElementById("wind-speed");
        const gust = document.getElementById("wind-gust");
        const sunrise = document.getElementById("sunrise");
        const sunset = document.getElementById("sunset");

        humidity.textContent = `${weather.atmosphere.humidity}%`;
        pressure.textContent = `${weather.atmosphere.pressure} mb`;
        uvIndex.textContent = weather.atmosphere.uvIndex;
        wind.textContent = `${weather.wind.speed} mph`;
        gust.textContent = `${(weather.wind.gust === null) ? "-" : weather.wind.gust + " mph"}`;
        sunrise.textContent = weather.sun.sunrise;
        sunset.textContent = weather.sun.sunset;

        const precipType = document.getElementById("precip-type");
        const precipProb = document.getElementById("precip-prob");
        const precipAmount = document.getElementById("precip-amount");

        precipType.textContent = `${(!weather.precipitation.precipType || weather.precipitation.precipType.length === 0) ? "no precipitation" : weather.precipitation.precipType.join(" & ")}`;
        precipProb.textContent = `${weather.precipitation.precipProb}%`;
        precipAmount.textContent = `${(weather.precipitation.precip === null) ? "0" : Math.round(weather.precipitation.precip * 100) / 100}`;
    }

    function validateLocation(searchBar) {
        // 1. reset custom validity
        searchBar.setCustomValidity("");

        // 2. check validity and set custom validity
        if (!searchBar.value.trim())
            searchBar.setCustomValidity("Location can't be empty!");
    }
    
    function setEventListeners() {
        // idle view: searchbar, custom validity 
        const idleForm = document.getElementById("search-form-idle");
        idleForm.addEventListener("submit", idleFormHandler);
        const idleSearchBar = document.getElementById("location-input-idle");
        idleSearchBar.addEventListener("input", () => {
            validateLocation(idleSearchBar);
        });

        // ready view: searchbar, custom validity
        const readyForm = document.getElementById("search-form");
        readyForm.addEventListener("submit", readyFormHandler);
        const readySearchBar = document.getElementById("location-input");
        readySearchBar.addEventListener("input", () => {
            validateLocation(readySearchBar);
        });
    }

    function initApp() {
        setEventListeners();
        showIdleView();
    }

    return {initApp, showReadyView};
})();

export default uiController;