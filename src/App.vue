<template>
  <div id="app">
    <RestAcademy :problemsUrl="problemsUrl" />
  </div>
</template>

<script>
import RestAcademy from "./RestAcademy.vue";

export default {
  name: "App",
  components: {
    RestAcademy
  },

  data: () => ({
    problemsUrl: [
      "/configurations/simple_get.yaml",
      "/configurations/name_register.yaml"
    ]
  })
};
</script>

<style>
#app {
  width: 70%;
  height: 500px;
  min-height: 500px;
  border: 1px solid gray;
  margin: auto;
}
</style>
