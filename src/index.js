import "./styles/fonts.css";
import "./styles/normalize.css";
import "./styles/style.css";

import AppController from "./modules/app-controller.js";

const promise = AppController.fetchWeather("gettysburg");
AppController.processWeatherData(promise);