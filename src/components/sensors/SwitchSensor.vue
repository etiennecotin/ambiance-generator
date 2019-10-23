<template>
  <div>
    <b-img :src="getSensorIcon" fluid @click="changeSwitchState"></b-img>
  </div>
</template>

<script>
export default {
  name: "SwitchSensor",
  props: {
    sensor: {
      type: Object,
      default: null
    }
  },
  computed: {
    switchState() {
      const resource = this.sensor.resources[this.sensor.resource];
      if (resource) {
        return resource;
      }
      return false;
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
    changeSwitchState() {
      this.sensor.resources[this.sensor.resource] = !this.switchState;
    }
  }
};
</script>

<style scoped></style>
