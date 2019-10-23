import Vue from "vue";

Vue.component("audioClip", () => import("./AudioSensor"));
Vue.component("Actuation", () => import("./SwitchSensor"));
