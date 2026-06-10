import AppController from "./app-controller.js"

/**
 * Wires forms, loading overlay, view toggles, and DOM rendering.
 * Calls AppController for data; never fetches the API directly.
 */
const uiController = (() => {

    /**
     * Fetch weather for a location, process data, render, and switch to ready view.
     * @param {HTMLFormElement} form - submitted search form
     * @param {string} location - city or country string
     * @param {HTMLElement} errorMessageDiv - inline error element for this form
     * @returns {Promise<void>}
     */
    async function fetchWeather(form, location, errorMessageDiv) {
        errorMessageDiv.textContent = "";
        document.getElementById("loading").classList.remove("loading--hidden");
        try {
            const data = await AppController.fetchWeather(location);
            AppController.processWeatherData(data);
            AppController.processWeeklyForcast(data);
            
            const weather = AppController.getCurrentWeather();
            if (weather) {
                await displayWeather(weather);
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
            document.getElementById("loading").classList.add("loading--hidden");
        }
    }

    /** @param {SubmitEvent} event */
    function idleFormHandler(event) {
        event.preventDefault();

        const form = event.currentTarget;
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

    /** @param {SubmitEvent} event */
    function readyFormHandler(event) {
        event.preventDefault();
        
        const form = event.currentTarget;
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

    /**
     * Render hero temps, location, condition, and description.
     * @param {import("./weather.js").default} weather
     */
    function developMainSection(weather) {
        const temperature = document.getElementById("temp-current");
        const location = document.getElementById("location");
        const condition = document.getElementById("condition");
        const feelsLike = document.getElementById("temp-feels");
        const description = document.getElementById("description");
        const tempMin = document.getElementById("temp-min");
        const tempMax = document.getElementById("temp-max");
        const currentUnit = AppController.getCurrentUnit();

        temperature.textContent = `${(currentUnit === "C") ? AppController.convertToCelcius(weather.temperature.current) : weather.temperature.current}°`;
        location.textContent = weather.location;
        condition.textContent = weather.condition;
        feelsLike.textContent = `Feels like ${(currentUnit === "C") ? AppController.convertToCelcius(weather.temperature.feelsLike) : weather.temperature.feelsLike}°`;
        description.textContent = weather.description;
        tempMin.textContent = `${(currentUnit === "C") ? AppController.convertToCelcius(weather.temperature.min) : weather.temperature.min}°`;
        tempMax.textContent = `${(currentUnit === "C") ? AppController.convertToCelcius(weather.temperature.max) : weather.temperature.max}°`;
    }

    /**
     * Load hero weather icon from bundled SVG assets.
     * Fails silently if the icon file is missing.
     * @param {import("./weather.js").default} weather
     * @returns {Promise<void>}
     */
    async function loadIcon(weather) {
        const iconElement = document.getElementById("icon-current");
        try {
            const icon = await import(`../assets/weather-icons/${weather.icon}.svg`);
            iconElement.src = icon.default;  
        }
        catch {
            iconElement.removeAttribute("src");
        }
        finally {
            iconElement.alt = weather.icon;
        }
    }

    /**
     * Render humidity, wind, sun, and precipitation metrics.
     * @param {import("./weather.js").default} weather
     */
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

    /**
     * Clear and rebuild the 7-day forecast grid from MiniWeather data.
     * @returns {Promise<void>}
     */
    async function developWeeklyForcast() {
        const weeklyForcast = AppController.getWeeklyForcast();
        const weeklyGrid = document.querySelector(".weekly__grid");
        const currentUnit = AppController.getCurrentUnit();

        weeklyGrid.innerHTML = "";

        for (const miniWeather of weeklyForcast) {
            let iconSrc = "";
            try {
                const icon = await import(`../assets/weather-icons/${miniWeather.icon}.svg`);
                iconSrc = icon.default;
            }
            catch {
                // missing icon file — card still renders without image
            }

            const html = `<article class="day-card glass">
                            <p class="day-card__label">${miniWeather.day}</p>
                            <div class="day-card__icon">
                                <img ${iconSrc ? `src="${iconSrc}"` : ""} alt="${miniWeather.icon}">
                            </div>
                            <p class="day-card__temps">
                                <span class="day-card__high">${(currentUnit === "C") ? AppController.convertToCelcius(miniWeather.tempMax) : miniWeather.tempMax}°</span>
                                <span class="day-card__low">${(currentUnit === "C") ? AppController.convertToCelcius(miniWeather.tempMin) : miniWeather.tempMin}°</span>
                            </p>
                            <p class="day-card__condition">${miniWeather.condition}</p>
                        </article>`;

            weeklyGrid.insertAdjacentHTML("beforeend", html);
        }
    }

    /**
     * Render all ready-view weather sections.
     * @param {import("./weather.js").default} weather
     * @returns {Promise<void>}
     */
    async function displayWeather(weather) {
        developMainSection(weather);
        await loadIcon(weather);
        developMetricsSection(weather);
        await developWeeklyForcast();
    }

    /**
     * Set custom validity on empty location input.
     * @param {HTMLInputElement} searchBar
     */
    function validateLocation(searchBar) {
        searchBar.setCustomValidity("");

        if (!searchBar.value.trim())
            searchBar.setCustomValidity("Location can't be empty!");
    }
    
    function setEventListeners() {
        const idleForm = document.getElementById("search-form-idle");
        idleForm.addEventListener("submit", idleFormHandler);
        const idleSearchBar = document.getElementById("location-input-idle");
        idleSearchBar.addEventListener("input", () => {
            validateLocation(idleSearchBar);
        });

        const readyForm = document.getElementById("search-form");
        readyForm.addEventListener("submit", readyFormHandler);
        const readySearchBar = document.getElementById("location-input");
        readySearchBar.addEventListener("input", () => {
            validateLocation(readySearchBar);
        });

        const unitBtnC = document.getElementById("unit-C");
        const unitBtnF = document.getElementById("unit-F");
        unitBtnC.addEventListener("click", () => {
            if (AppController.getCurrentUnit() === "C")
                return;

            unitBtnC.classList.add("unit-toggle__btn--active");
            unitBtnF.classList.remove("unit-toggle__btn--active");

            AppController.setCelcius();
            const weather = AppController.getCurrentWeather();
            if (weather)
                displayWeather(weather);
        });
        unitBtnF.addEventListener("click", () => {
            if (AppController.getCurrentUnit() === "F")
                return;

            unitBtnF.classList.add("unit-toggle__btn--active");
            unitBtnC.classList.remove("unit-toggle__btn--active");

            AppController.setFarenhite();
            const weather = AppController.getCurrentWeather();
            if (weather)
                displayWeather(weather);
        });
    }

    /** Wire listeners and show the idle landing view. */
    function initApp() {
        setEventListeners();
        showIdleView();
    }

    return {initApp};
})();

export default uiController;
