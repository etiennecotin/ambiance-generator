import socket from "./MqttClient";
import store from "../store";

export const removeWidget = widget => {
  return new Promise((resolve, reject) => {
    widget.forEach(sensor => {
      try {
        removeSensor(sensor).then(e => console.log('sensor is removed'));
      } catch (e) {
        reject(e);
        console.log(e);
      }
    });
    resolve(true);
  });
};

const removeSensor = async sensor => {
  await socket.client.publish(
    `${store.getters.devEui}-out/3/${sensor.type}/${sensor.nativeNodeId}/${sensor.nativeSensorId}/${sensor.resource}`,
    "Nothing"
  );
};
