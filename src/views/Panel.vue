<template>
  <div>
    <Header />
    <b-container fluid style="margin-top: 2%">
      <b-row>
        <b-col cols="9">
          <b-card-group deck>
            <b-col
              class="col-6"
              v-for="(sensorGroup, index) in allSensors"
              :key="index"
            >
              <Widget :sensor-group="sensorGroup" :index-group="index"></Widget>
            </b-col>
          </b-card-group>
        </b-col>
        <b-col style="flex-direction: column">
          <p>Panel de gestion des devices</p>
          <b-button @click="createSensor">Add sensor</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Header from "../components/Header";
import Widget from "../components/Widget";
import socket from "../services/MqttClient";
import { mapGetters } from "vuex";
export default {
  name: "panel",
  components: { Header, Widget },
  data() {
    return {
      source: null
    };
  },
  computed: {
    ...mapGetters(["allSensors"])
  },
  methods: {
    async createSensor() {
      console.log("create sensor");
      const sensorLength = this.allSensors.length;
      await socket.client.publish(
        `${this.$store.getters.devEui}-out/0/3339/${sensorLength}/2/5522`,
        "nothing"
      );
      await socket.client.publish(
        `${this.$store.getters.devEui}-out/0/3306/${sensorLength}/3/5850`,
        0
      );
      await this.$store.dispatch("getFullState");
      await socket.client.subscribe(`69b970dd549d56c619e1ed9223dedaf2-out/0/#`);
    }
  }
};
</script>

<style scoped></style>
