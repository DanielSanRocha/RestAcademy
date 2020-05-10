<template>
  <div id="app">
    <RestAcademy :problemsUrl="problemsUrl" :manualPagesUrl="manualPagesUrl" />
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
    problemsUrl: ["/problems/simple_get.yaml", "/problems/name_register.yaml"],
    manualPagesUrl: ["/manual/about.yaml"]
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
