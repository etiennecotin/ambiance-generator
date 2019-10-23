<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Device ID:"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-1"
          v-model="form.deviceId"
          type="text"
          required
          placeholder="Enter le device id"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label=":" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.apiKey"
          required
          placeholder="Enter l'api key"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="secondary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
  import socket from "../services/MqttClient";
export default {
  name: "login",
  data() {
    return {
      form: {
        // deviceId: "5d8cb0b24e900c002d56e6b2",
        deviceId: process.env.VUE_APP_DEVICE_ID,
        // apiKey: "8d83258e0a3c800fd017b7b808772b25452cbc55"
        apiKey: process.env.VUE_APP_API_KEY
      },
      foods: [
        { text: "Select One", value: null },
        "Carrots",
        "Beans",
        "Tomatoes",
        "Corn"
      ],
      show: true
    };
  },
  // mounted() {
  //   socket.initSocket();
  // },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      console.log(JSON.stringify(this.form));
      this.$store.dispatch("authenticate", this.form).then(response => {
        console.log(response);
        this.$router.push({ name: "home" });
      });
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.email = "";
      this.form.name = "";
      this.form.food = null;
      this.form.checked = [];
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  }
};
</script>

<style scoped></style>
