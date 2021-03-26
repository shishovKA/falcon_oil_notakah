import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import GasStation from './gasStation';
import config from './config'

export default new Vuex.Store({
  state: {
    stations = [],  // array of GasStations
    monthPlan = [], // array from 0 to 11 of gas volumes
    bank = 0,
    fuelStorage = 0,

  },
  mutations: {
    setInitState (state, config) {
      // state.count += n
    }
  },
  actions: {
  },
  modules: {
  }
})

const testStation = new GasStation(config.STATION_FUEL_LEFT, config.sationParams);
testStation.setFuelMonthPlan(500);

console.log('cost', testStation.countCost(2));
