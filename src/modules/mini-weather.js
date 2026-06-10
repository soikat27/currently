
/**
 * One day in the 7-day forecast row.
 * Holds only what a day-card needs: label, highs/lows, icon id, condition.
 */
export default class MiniWeather {

    /**
     * @param {string} day - label (e.g. "Tomorrow", "Mon")
     * @param {number} tempMin - daily low (°F from API)
     * @param {number} tempMax - daily high (°F from API)
     * @param {string} icon - Visual Crossing icon id
     * @param {string} condition - short conditions text
     */
    constructor(day, tempMin, tempMax, icon, condition) {
        this.day = day;
        this.tempMin = tempMin;
        this.tempMax = tempMax;
        this.icon = icon;
        this.condition = condition;
    }
}
