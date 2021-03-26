export class GasStation {

    constructor(storage, params) {
        this.params = params;
        this.storage = storage;
        this.placesCount = 1;
        this.fuelDeliveredThisMonth = 0;
    }

    setFuelMonthPlan(fuel) {
        this.fuelDeliveredThisMonth = fuel;
    }

    countCost(p) {
        const cashiers = Math.ceil(p / this.params.PLACES_COUNT_PER_CASHIER);
        let cost = 
            this.params.STATION_COST +
            this.params.PLACE_COST * p +
            this.params.SALARIES.tanker * p +
            this.params.SALARIES.cashier * cashiers +
            this.params.SALARIES.director +
            this.params.SALARIES.security
        ;
        return cost;
    }

    countProfit(p) {
        let fuelLeft = this.storage + this.fuelDeliveredThisMonth;
        const cashiers = Math.ceil(p / this.params.PLACES_COUNT_PER_CASHIER);
        const canSellTimes = (1/this.params.SERVICE_TIME) * p;
        const fuelPortions = fuelLeft / this.params.CLIENT_FUEL_VOLUME;
        const resultSellTimes = Math.min(canSellTimes, fuelPortions);
        const profit = resultSellTimes*this.params.CLIENT_PROFIT;
        return { profit: profit, fuelLeft: fuelLeft};
    }

    calculateConfigForVolume() {
        let placesCount = 1;
        let startProfit = this.countProfit(placesCount).profit - this.countCost(placesCount);
    }




  
    
}