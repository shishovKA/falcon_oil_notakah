export const config = {
    STATION_FUEL_LEFT: 100, // остаток топлива на АЗС
    STORAGE_FUEL_LEFT: 500, // остаток топлива в хранилище
    STATION_EXIST_COUNT: 3, // количество существующих АЗС
    TANKER_EXIST_COUNT: 5, // количество существующих танкеров для поставки топлива
    TANKER_COST: 200, // стоимость одного танкера
    TANKER_DELIVER_TIME: 0.1, // время, за которое танкер доставит топливо в АЗС
    
    sationParams: {
        SERVICE_TIME: 0.001, // время на обслуживание одной машины
        CLIENT_FUEL_VOLUME: 2,
        CLIENT_PROFIT: 15, // прибыль, полученная с одной машины
        STATION_COST: 50, 
        PLACE_COST: 12,
        SALARIES: {
            cashier: 1000,
            tanker: 500,
            director: 2000,
            security: 700,
        },
        PLACES_COUNT_PER_CASHIER: 3,
    },

    MONTH_RANGE_SEC: 5,
}