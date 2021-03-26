import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { GasStation } from './gasStation';
import { config } from './config'

export default new Vuex.Store({
  state: {
    stations: [],  // array of GasStations
    monthPlan: [], // array from 0 to 11 of gas volumes
    bank: 0,
    fuelStorage: 0,

  },
  mutations: {
    setInitState (state) {
      for (let i=0; i<=config.STATION_EXIST_COUNT; i++) {
        const station = new GasStation(config.STATION_FUEL_LEFT, config.sationParams);
        state.stations.push(station);
      }
      state.fuelStorage = config.STORAGE_FUEL_LEFT;
    }
  },
  actions: {
  },
  modules: {
  }
})

const testStation = new GasStation(config.STATION_FUEL_LEFT, config.sationParams);
testStation.setFuelMonthPlan(15500);

console.log('profit', testStation.countProfit(1));
console.log('tt', testStation.calculateConfigForVolume() )
