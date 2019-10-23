import mqtt from "async-mqtt";
import { mqttEndpoint } from "../config/aloes";
import store from "../store";
import { EventBus } from "../eventBus";
import { analyseTopic } from "../services/treatMqttMessage";

const Storage = window.sessionStorage;

// const brokerUrl = process.env.VUE_APP_BROKER_URL;
const baseOptions = {
  //  keepalive: 60,
  // reschedulePings: true,
  protocolId: "MQTT",
  protocolVersion: 4,
  reconnectPeriod: 3000,
  connectTimeout: 30 * 1000,
  clean: true,
  clientId: null,
  username: null,
  password: null
};

const socket = {};

const setSocketId = socketId => {
  if (Storage) {
    Storage.setItem("socket-id", socketId);
  }
};

const delSocketId = () => {
  if (Storage) {
    Storage.removeItem("socket-id");
  }
};

const getSocketId = () => {
  return Storage && Storage.getItem("socket-id");
};

socket.initSocket = async () => {
  try {
    let socketId = getSocketId();
    if (socketId && socket.client) {
      return socket;
    }
    baseOptions.clientId = store.state.app.devEui;
    baseOptions.username = store.state.app.deviceId;
    baseOptions.password = store.state.app.apiKey;
    socket.client = await mqtt.connectAsync(
      process.env.VUE_APP_SERVE_MQTT,
      baseOptions
    );

    socket.client.on("message", (topic, message) => {
      console.log("mqtt => topic", topic);
      console.log("mqtt => message", message);
      // store.dispatch("getFullState");
      const treatedTopic = analyseTopic(topic);

      // EventBus.$emit("mqttMessage", { treatedTopic, message });
      store.dispatch("updateState", { treatedTopic, message });
    });

    socket.client.on("connect", async state => {
      setSocketId(baseOptions.clientId);
    });

    socket.client.on("offline", () => {
      delSocketId();
    });

    console.log(socket.client);
    return socket;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default socket;
