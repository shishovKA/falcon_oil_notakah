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

    countProfit(p) {
        let fuelLeft = this.storage + this.fuelDeliveredThisMonth;
        const cashiers = Math.ceil(p / this.params.PLACES_COUNT_PER_CASHIER);
        const canSellTimes = (1/this.params.SERVICE_TIME) * p;
        const fuelPortions = fuelLeft / this.params.CLIENT_FUEL_VOLUME;
        const resultSellTimes = Math.min(canSellTimes, fuelPortions);
        const profit = resultSellTimes*this.params.CLIENT_PROFIT;
        fuelLeft -= resultSellTimes*this.params.CLIENT_FUEL_VOLUME; 

        let cost = 
            this.params.STATION_COST +
            this.params.PLACE_COST * p +
            this.params.SALARIES.tanker * p +
            this.params.SALARIES.cashier * cashiers +
            this.params.SALARIES.director +
            this.params.SALARIES.security
        ;
        return { profit: profit, cost: cost, delta: (profit-cost), fuelLeft: fuelLeft};
    }

    calculateConfigForVolume() {
        let p = 1;
        let curProfit;
        do {
            console.log(p, this.countProfit(p));
            p += 1;
          } while (this.countProfit(p).delta > this.countProfit(p-1).delta);
        return  p-1;
    }




  
    
}