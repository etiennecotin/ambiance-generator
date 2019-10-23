import { HTTP } from "../../api";

const state = {
  sensors: []
};

// getters
const getters = {
  sensors: state => state.sensors
};
// actions
const actions = {
  getSensors({ commit }, { deviceId, apiKey }) {
    return new Promise((resolve, reject) => {
      HTTP.post(`/Devices/get-full-state/${deviceId}`, {
        deviceId: deviceId,
        apiKey: apiKey
      })
        .then(response => {
          const data = response.data;
          commit("updateState", data);
          resolve(data);
        })
        .catch(function(error) {
          console.log(error);
          reject(error);
        });
    });
  }
};

// mutations
const mutations = {
  stockSensors(state, device) {
    state.loaded = true;
    state.device = device;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
