<template>
  <b-card
    :header="`Widget ${indexGroup + 1}`"
    header-tag="header"
    footer-tag="footer"
  >
    <component
      v-for="(sensor, index) in sensorGroup"
      :is="mappingSensor[sensor.name]"
      :sensor="sensor"
      :index="indexGroup"
      :key="sensor.name + index"
    ></component>

    <b-button href="#" variant="primary" @click="removeSensor(sensor)"
      >remove</b-button
    >
  </b-card>
</template>

<script>
import socket from "../services/MqttClient";
import { removeWidget } from "../services/removeWidget";
export default {
  name: "Widget",
  props: {
    sensorGroup: {
      type: Array,
      default: null
    },
    indexGroup: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      mappingSensor: {
        "Audio clip": "audioClip",
        Actuation: "Actuation"
      }
    };
  },
  methods: {
    async removeSensor() {
      console.log("remove sensor");
      await socket.client.subscribe(`${this.$store.getters.devEui}-out/#`);
      removeWidget(this.sensorGroup);
    }
  }
};
</script>

<style scoped></style>
