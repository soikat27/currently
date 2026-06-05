import AppController from "./app-controller.js"

const uiController = (() => {
    async function fetchWeather(event) {
        event.preventDefault();

        const form = event.currentTarget;
        // validate form-fields
        validateLocationIdle();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const location = document.getElementById("location-input-idle").value;
        try {
            const data = await AppController.fetchWeather(location);
            AppController.processWeatherData(data);
            const weather = AppController.getCurrentWeather();

            if (weather) {
                developMainSection(weather);

                showReadyView();
            }
        }
        catch(error) {
            console.log(error);
        }
        finally {
            form.reset();
        }
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

    function validateLocationIdle() {
        // 1. reset custom validity
        const searchBar = document.getElementById("location-input-idle");
        searchBar.setCustomValidity("");

        // 2. check validity and set custom validity
        if (!searchBar.value.trim())
            searchBar.setCustomValidity("Location can't be empty!");
    }
    
    function setEventListeners() {
        // idle view: searchbar, custom validity 
        const idleForm = document.getElementById("search-form-idle");
        idleForm.addEventListener("submit", fetchWeather);
        const idleSearchBar = document.getElementById("location-input-idle");
        idleSearchBar.addEventListener("input", validateLocationIdle);


    }

    function initApp() {
        setEventListeners();
        showIdleView();
    }

    return {initApp, showReadyView};
})();

export default uiController;