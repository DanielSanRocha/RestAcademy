<template>
  <div class="manual">
    <div v-if="loading" class="loading-container">
      <loading />
    </div>
    <div class="manual-text-container" v-else>
      <span class="bold">Manual Page - {{this.config.name}}</span>
      <!-- <span class="text">{{this.config.text}}</span> -->
      <div v-html="textHTML"></div>
    </div>
  </div>
</template>

<script>
import yaml from "js-yaml";
import loading from "./Loading";
import showdown from "showdown";

export default {
  name: "ManualPage",
  props: ["configUrl"],
  components: { loading },
  data: () => ({
    loading: true,
    config: { text: "" },
    textHTML: ""
  }),
  mounted: function() {
    this.showdownConverter = new showdown.Converter();
    if (this.configUrl) this.loadConfigurationFromUrl(this.configUrl);
    this.renderText();
  },
  methods: {
    renderText() {
      let text = this.config.text;
      text = text.replace(/\\n/gi, "\n");
      this.textHTML = this.showdownConverter.makeHtml(text);
    },
    loadConfigurationFromUrl(url) {
      this.loading = true;

      fetch(url)
        .then(response => response.text())
        .then(text => this.setConfiguration(yaml.safeLoad(text)))
        .then(() => this.renderText())
        .then(() => {
          this.loading = false;
        })
        .catch(err => console.error(err));
    },
    setConfiguration(config) {
      this.config = config;
    }
  },
  watch: {
    configUrl: function(url) {
      if (url) this.loadConfigurationFromUrl(url);
    }
  }
};
</script>

<style scoped>
.manual-text-container {
  overflow-y: scroll;
}

.tests-list {
  /* display: none; */
  background-color: #f5f5f6;

  padding: 0px;
}

.loading-container {
  margin: 10% auto 0 auto;
  width: 100%;
  height: 100%;
}

.manual .bold {
  font-size: 18px;
  font-weight: bold;
  color: black;
  display: block;
  margin: 5px 0 5px 0;
}

.manual .text {
  margin: 0 0 25px 0;
  display: block;
}

.manual {
  font-family: "Open Sans", sans-serif;
  color: #939694;
  font-size: 16px;

  display: block;
  height: 100%;
  width: 98%;

  margin: auto;
}

.test-button-container input {
  margin-top: 30px;
  width: 250px;
}

.test-button-container button {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 4px;
  margin-left: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
}

.tests-list li {
  display: flex;
  margin: 0;
}

.test-status-container {
  margin: 0 0 0 auto;
  padding: 0 8px 0 8px;
}

.test-status-failed {
  color: red;
}

.test-status-undefined {
  color: black;
}

.test-status-success {
  color: green;
}

.test-error-message {
  color: red;
  margin-left: 3%;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 50%;
  overflow: hidden;
}

.test-description {
  margin-left: 3%;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 40%;
  overflow: hidden;
}
</style>
