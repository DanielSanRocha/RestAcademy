<template>
  <div class="problem">
    <div v-if="loading" class="loading-container">
      <loading />
    </div>
    <div v-else>
      <span class="bold">Problem - {{this.config.name}}</span>
      <!-- <span class="text">{{this.config.text}}</span> -->
      <div v-html="textHTML"></div>

      <span class="bold">Tests</span>

      <ul class="tests-list">
        <li :key="index" v-for="(item, index) in this.testsWithStatus">
          <span
            class="test-description"
          >{{item.config.method}} {{item.config.route}} -> Expected (Status Code {{item.config.status_code}})</span>
          <span
            class="test-error-message"
            v-if="item.lastRequest.output"
          >{{item.lastRequest.output}}</span>
          <div class="test-status-container">
            <span v-if="!item.lastRequest.status">
              <i class="fas fa-question test-status-undefined"></i>
            </span>
            <span v-else-if="item.lastRequest.status === 'failed'">
              <i class="fas fa-times test-status-failed"></i>
            </span>
            <span v-else-if="item.lastRequest.status === 'success'">
              <i class="fas fa-check test-status-success"></i>
            </span>
            <span v-else-if="item.lastRequest.status === 'loading'">
              <i class="fas fa-spinner fa-spin test-status-undefined"></i>
            </span>
          </div>
        </li>
      </ul>
      <div class="test-button-container">
        <input v-model="testUrl" placeholder="Rest URL (e.g. http://localhost:5000/)" />
        <button @click="testIt">Test It!</button>
      </div>
    </div>
  </div>
</template>

<script>
import yaml from "js-yaml";
import loading from "./Loading";
import "@fortawesome/fontawesome-free/css/all.css";
import TestEngine from "./TestEngine.js";
import showdown from "showdown";

export default {
  name: "Problem",
  props: ["configUrl"],
  components: { loading },
  data: () => ({
    loading: true,
    config: {},
    lastRequests: [],
    testUrl: "http://localhost:5000/",
    textHTML: "",
    testsWithStatus: {}
  }),
  mounted: function() {
    this.showdownConverter = new showdown.Converter();
    if (this.configUrl) this.loadConfigurationFromUrl(this.configUrl);
    this.renderText();
  },
  methods: {
    generateTestsWithStatus() {
      this.testsWithStatus = this.lastRequests.map((item, index) => ({
        config: this.config.tests[index],
        lastRequest: item
      }));
    },
    renderText() {
      let text = this.config.text;
      text = text.replace(/\\n/gi, "\n");
      this.textHTML = this.showdownConverter.makeHtml(text);
    },
    setLastRequest(index, lastRequest) {
      this.lastRequests[index] = lastRequest;
      this.generateTestsWithStatus();
    },
    initializeLastRequests(status) {
      this.lastRequests = new Array(this.config.tests.length).fill({ status });
      this.generateTestsWithStatus();
    },
    loadConfigurationFromUrl(url) {
      this.loading = true;

      fetch(url)
        .then(response => response.text())
        .then(text => this.setConfiguration(yaml.safeLoad(text)))
        .then(() => this.renderText())
        .then(() => this.generateTestsWithStatus())
        .then(() => {
          this.loading = false;
        })
        .catch(err => console.error(err));
    },
    setConfiguration(config) {
      this.config = config;
      this.initializeLastRequests(undefined);
    },
    async testIt() {
      this.initializeLastRequests("loading");

      let testEngine = new TestEngine(this.testUrl);

      for (let index in this.config.tests) {
        let test = this.config.tests[index];

        await testEngine
          .test(test)
          .then(lastRequest =>
            Promise.resolve(this.setLastRequest(index, lastRequest))
          )
          .catch(err => {
            console.warn(err);
            this.setLastRequest(index, {
              status: "failed",
              output: err.message
            });
          });
      }
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

.problem .bold {
  font-size: 16px;
  font-weight: bold;
  color: black;
  display: block;
  margin: 5px 0 5px 0;
}

.problem .text {
  margin: 0 0 25px 0;
  display: block;
}

.problem {
  font-family: "Open Sans", sans-serif;
  color: #939694;
  font-size: 14px;

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
