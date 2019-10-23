import socket from "./MqttClient";
import store from "../store";

export const removeWidget = widget => {
  widget.forEach(sensor => {
    try {
      removeSensor(sensor).then(e => console.log(e));
    } catch (e) {
      console.log(e);
    }
  });
};

const removeSensor = async sensor => {
  await socket.client.publish(
    `${store.getters.devEui}-out/3/${sensor.type}/${sensor.nativeNodeId}/${sensor.nativeSensorId}/${sensor.resource}`,
    "Nothing"
  );
};
