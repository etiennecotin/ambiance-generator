<template>
  <div>
    <p v-if="needAudio">{{ playSound ? "Is playing" : "Stopped" }}</p>

    <input
      type="file"
      name="pic"
      accept="audio/mp3,audio/*;capture=microphone"
      :ref="'audio' + index"
    />
    <b-button v-if="canPlay" @click="updateSensor('audio' + index)"
      >Update audio</b-button
    >
    <b-button v-else @click="updateSensor('audio' + index)">{{ !needAudio ? 'Add audio' : 'Update audio '}}</b-button>
  </div>
</template>

<script>
import socket from "../../services/MqttClient";

export default {
  name: "AudioSensor",
  props: {
    sensor: {
      type: Object,
      default: null
    },
    index: {
      type: Number
    },
    playSound: {
      type: Boolean
    },
    needAudio: {
      type: Boolean
    }
  },
  data() {
    return {
      source: null,
      audioContext: null,
      decodedAudio: null,
      canPlay: null
    };
  },
  mounted() {
    this.initAudio();
  },
  methods: {
    async updateSensor(audioInput) {
      console.log("update sensor", audioInput);

      const [audioFile] = this.$refs[audioInput].files;
      let reader = new FileReader();
      reader.onload = async () => {
        const arrayBuffer = Buffer.from(reader.result);
        console.log(reader.result, arrayBuffer);

        await socket.client.publish(
          `${this.$store.getters.devEui}-out/1/${this.sensor.type}/${this.sensor.nativeNodeId}/${this.sensor.nativeSensorId}/${this.sensor.resource}`,
          arrayBuffer
        );
      };
      reader.readAsArrayBuffer(audioFile);

      await socket.client.subscribe(`69b970dd549d56c619e1ed9223dedaf2-out/1/#`);
    },
    async initAudio() {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      if (
        this.sensor.resources[this.sensor.resource] &&
        this.sensor.resources[this.sensor.resource].data
      ) {
        const buffer = this.sensor.resources[this.sensor.resource];
        const arrayBuffer = Buffer.from(buffer).buffer;
        this.decodedAudio = await this.audioContext.decodeAudioData(
          arrayBuffer
        );
        this.canPlay = true;
      } else {
        this.canPlay = false;
      }
    },
    async listenSensor(justOne) {
      this.source = this.audioContext.createBufferSource();
      this.source.buffer = this.decodedAudio;
      this.source.connect(this.audioContext.destination);
      this.source.loop = true;
      this.source.start(0);
    },
    stopSensor() {
      if (this.source) {
        this.source.stop();
      }
    }
  },
  watch: {
    sensor: {
      handler(val, oldVal) {
        this.initAudio();
      },
      deep: true,
      immediate: true
    },
    playSound: {
      handler(val) {
        if (val) {
          console.log("play");
          this.listenSensor();
        } else {
          this.stopSensor();
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style scoped></style>
