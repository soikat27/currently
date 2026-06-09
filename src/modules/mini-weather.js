export default class MiniWeather {
    constructor(day, tempMin, tempMax, icon, condition) {
        this.day = day
        this.tempMin = tempMin;
        this.tempMax = tempMax;
        this.icon = icon;
        this.condition = condition;
    }
}