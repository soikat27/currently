const uiController = (() => {
    function fetchWeather(event) {
        event.preventDefault();

        const form = event.currentTarget;
        // validate form-fields
        validateLocation();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // const location = document.getElementById("location-input-idle").value;

    }

    function validateLocation() {
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
        idleSearchBar.addEventListener("input", validateLocation);
    }

    function initApp() {
        setEventListeners();
    }

    return {initApp};
})();

export default uiController;