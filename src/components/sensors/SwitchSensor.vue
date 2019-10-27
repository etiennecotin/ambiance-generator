<template>
  <div>
    <b-img :src="getSensorIcon" fluid @click="changeSwitchState"></b-img>
  </div>
</template>

<script>
import socket from "../../services/MqttClient";

export default {
  name: "SwitchSensor",
  props: {
    sensor: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      switchValue: false
    };
  },
  mounted() {
    this.initSwitch();
  },
  computed: {
    switchState: {
      get: function() {
        return this.switchValue;
      },
      set: function(val) {
        this.switchValue = val;
      }
    },
    getSensorIcon() {
      let icon;
      if (this.switchState) {
        icon = this.sensor.icons[0];
      } else {
        icon = this.sensor.icons[1];
      }
      return `${process.env.VUE_APP_ALOES_SERVE}${icon}`;
    }
  },
  methods: {
    initSwitch() {
      if (this.sensor && this.sensor.resources[this.sensor.resource]) {
        this.switchState = this.sensor.resources[this.sensor.resource];
      } else {
        this.switchState = false;
      }
    },
    async changeSwitchState() {
      console.log(
        "update sensor switch topic => ",
        `${this.$store.getters.devEui}-out/1/${this.sensor.type}/${this.sensor.nativeNodeId}/${this.sensor.nativeSensorId}/${this.sensor.resource}`
      );
      await socket.client.subscribe(
        `${this.$store.getters.devEui}-out/1/${this.sensor.type}/${this.sensor.nativeNodeId}/${this.sensor.nativeSensorId}/${this.sensor.resource}`
      );
      await socket.client.publish(
        `${this.$store.getters.devEui}-out/1/${this.sensor.type}/${this.sensor.nativeNodeId}/${this.sensor.nativeSensorId}/${this.sensor.resource}`,
        JSON.stringify(!this.switchState)
      );
    }
  },
  watch: {
    sensor: {
      handler(val) {
        this.switchState = val.resources[val.resource];
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style scoped></style>
