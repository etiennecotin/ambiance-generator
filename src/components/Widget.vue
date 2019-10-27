<template>
  <b-card
    :header="`Widget ${indexGroup + 1}`"
    header-tag="header"
    footer-tag="footer"
  >
    <audio-sensor
      :sensor="getSensorAudio"
      :index="indexGroup"
      :playSound="playSound"
      v-if="getSensorAudio"
      :needAudio="showSwitch"
    ></audio-sensor>
    <switch-sensor
      :sensor="getSensorSwitch"
      :index="indexGroup"
      :playSound="playSound"
      v-if="getSensorSwitch && showSwitch"
    ></switch-sensor>
    
    <b-button href="#" variant="primary" @click="removeSensor(sensor)"
      >remove</b-button
    >
  </b-card>
</template>

<script>
import socket from "../services/MqttClient";
import { removeWidget } from "../services/removeWidget";
import AudioSensor from "./sensors/AudioSensor";
import SwitchSensor from "./sensors/SwitchSensor";
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
  components: {
    audioSensor: AudioSensor,
    switchSensor: SwitchSensor
  },
  data() {
    return {
      mappingSensor: {
        "Audio clip": "audioClip",
        Actuation: "Actuation"
      }
    };
  },
  computed: {
    getSensorAudio() {
      return this.sensorGroup.find(sensor => sensor.type === 3339);
    },
    getSensorSwitch() {
      return this.sensorGroup.find(sensor => sensor.type === 3306);
    },
    showSwitch() {
      return !!(
        this.getSensorAudio &&
        this.getSensorAudio.resources[this.getSensorAudio.resource] &&
        this.getSensorAudio.resources[this.getSensorAudio.resource].data
      );
    },
    playSound() {
      return !!(
        this.getSensorSwitch &&
        this.getSensorSwitch.resources &&
        this.getSensorSwitch.resources[this.getSensorSwitch.resource]
      );
    }
  },
  methods: {
    async removeSensor() {
      console.log("remove sensor");
      await socket.client.subscribe(`${this.$store.getters.devEui}-out/#`);
      removeWidget(this.sensorGroup).then(() =>
        this.$store.dispatch("removeWidget", this.indexGroup)
      );
    }
  }
};
</script>

<style scoped></style>
