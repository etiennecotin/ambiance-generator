<template></template>

<script>
export default {
  name: "Logout",
  created() {
    this.logout();
  },
  methods: {
    logout() {
      this.$store.dispatch("clearStore").then(() => {
          console.log();
      });
    }
  }
};
</script>

<style scoped></style>
