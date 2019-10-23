import { HTTP } from "../../api";
import socket from "../../services/MqttClient";
import { treat } from "../../services/TreatFullState";

const state = {
  loaded: false,
  online: false,
  device: null,
  deviceId: null,
  devEui: null,
  apiKey: null,
  sensors: []
};

// getters
const getters = {
  isAuthenticate: state => state.loaded,
  allSensors: state => state.sensors,
  devEui: state => state.devEui
};
// actions
const actions = {
  clearStore({ commit }) {},
  authenticate({ dispatch, commit }, { deviceId, apiKey }) {
    return new Promise((resolve, reject) => {
      HTTP.post("/Devices/authenticate", {
        deviceId: deviceId,
        apiKey: apiKey
      })
        .then(response => {
          const data = response.data;
          console.log(data);
          data.deviceId = deviceId;
          commit("updateState", data);
          socket.initSocket();

          dispatch("getFullState")
            .then(() => {
              resolve(data);
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(function(error) {
          console.log(error);
          reject(error);
        });
    });
  },
  getFullState({ state, commit }) {
    return new Promise((resolve, reject) => {
      HTTP.get(`/Devices/get-full-state/${state.deviceId}`, {
        headers: {
          devEui: state.devEui,
          apiKey: state.apiKey
        }
      })
        .then(response => {
          const data = response.data;
          const nodes = treat(data.sensors);
          commit("updateFullState", { fullState: data, nodes: nodes });
          resolve(nodes);
        })
        .catch(function(error) {
          console.log(error);
          reject(error);
        });
    });
  },
  updateState({ state, commit }, { treatedTopic, message }) {
    console.log(treatedTopic, message);
    switch (treatedTopic.type) {
      case "3339":
        commit("updateAudio", { treatedTopic, message });
        break;
      case "3306":
        commit("updateSwitch", { treatedTopic, message });
        break;
    }
  }
};

// mutations
const mutations = {
  updateState(state, device) {
    state.loaded = true;
    state.device = device.device;
    state.devEui = device.device.devEui;
    state.deviceId = device.deviceId;
    state.apiKey = device.device.apiKey;
  },
  updateFullState(state, params) {
    state.fullState = params.fullState;
    state.sensors = params.nodes;
  },
  updateAudio(state, params) {
    // state.sensors.fil
    // console.log(state.sensors[params.treatedTopic.nativeNodeId]);
    const sensor = state.sensors[params.treatedTopic.nativeNodeId].find(el => {
      console.log(el)
      return el.nativeType == params.treatedTopic.type;
    });
    console.log(sensor);
    sensor.resources[params.treatedTopic.resource] = {
      data: Array.from(params.message),
      type: "Buffer"
    };
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
