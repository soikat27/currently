import AppController from "./app-controller.js"

const uiController = (() => {
    function fetchWeather(event) {
        event.preventDefault();

        const form = event.currentTarget;
        // validate form-fields
        validateLocationIdle();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const location = document.getElementById("location-input-idle").value;
        // try {
        //     const data = AppController.fetchWeather(location);
        //     const weather = AppController.processWeatherData(data);
        // }
        // catch(error) {

        // }

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

    // function developMainSection() {

    // }

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
    }

    return {initApp};
})();

export default uiController;