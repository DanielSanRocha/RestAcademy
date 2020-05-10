<template>
  <div class="rest-academy-container">
    <div class="manual-or-problem-container" v-if="!manual">
      <div class="problem-container">
        <Problem :configUrl="currentProblemUrl" />
      </div>
      <div class="pagination-container">
        <paginate
          :page-count="problemsUrl.length"
          :page-range="5"
          :initial-page="1"
          v-model="currentProblemPage"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :click-handler="onProblemPageChanged"
        ></paginate>
      </div>
    </div>
    <div class="manual-or-problem-container" v-else>
      <div class="manualpage-container">
        <ManualPage :configUrl="currentManualPageUrl" />
      </div>
      <div class="pagination-container">
        <paginate
          :page-count="manualPagesUrl.length"
          :page-range="5"
          :initial-page="1"
          v-model="currentManualPage"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :click-handler="onManualPageChanged"
        ></paginate>
      </div>
    </div>
    <div class="manual-button-container">
      <button
        @click="toggleManual"
        class="manual-button"
        :class="[this.manual ? 'manual-button-active' : '']"
      >
        <i class="fas fa-book fa-2x"></i>
      </button>
    </div>
  </div>
</template>

<script>
import Problem from "./components/Problem.vue";
import Paginate from "vuejs-paginate";
import ManualPage from "./components/ManualPage.vue";

export default {
  name: "RestAcademy",
  props: ["problemsUrl", "manualPagesUrl"],
  components: {
    Problem,
    Paginate,
    ManualPage
  },
  data: () => ({
    manual: true,
    currentManualPageUrl: undefined,
    currentProblemUrl: undefined,
    currentProblemPage: 1,
    currentManualPage: 1
  }),
  mounted: function() {
    this.setCurrentProblemUrl();
    this.setCurrentManualPageUrl();

    this.loadCurrentState();
  },
  methods: {
    toggleManual() {
      this.manual = !this.manual;

      this.saveCurrentState();
    },
    onProblemPageChanged: function() {
      this.setCurrentProblemUrl();

      this.saveCurrentState();
    },
    onManualPageChanged: function() {
      this.setCurrentManualPageUrl();

      this.saveCurrentState();
    },
    setCurrentProblemUrl() {
      let currentProblemPage = this.currentProblemPage
        ? this.currentProblemPage
        : 1;
      this.currentProblemUrl = this.problemsUrl[currentProblemPage - 1];
    },
    setCurrentManualPageUrl() {
      let currentManualPage = this.currentManualPage
        ? this.currentManualPage
        : 1;
      this.currentManualPageUrl = this.manualPagesUrl[currentManualPage - 1];
    },
    saveCurrentState() {
      localStorage.setItem(
        "rest-academy-state",
        JSON.stringify({
          currentProblemPage: this.currentProblemPage,
          currentManualPage: this.currentManualPage,
          manual: this.manual
        })
      );
    },
    loadCurrentState() {
      let state = localStorage.getItem("rest-academy-state");

      if (state) {
        state = JSON.parse(state);

        this.currentProblemPage = state.currentProblemPage;
        this.currentManualPage = state.currentManualPage;
        this.manual = state.manual;

        this.setCurrentManualPageUrl();
        this.setCurrentProblemUrl();
      }
    }
  }
};
</script>

<style>
.manual-or-problem-container {
  flex-direction: column;
  display: flex;
  height: 100%;
}

.rest-academy-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.pagination-container {
  /* margin: auto; */
  margin: 0 auto 0 auto;

  width: 100%;
  height: 60px;

  background-color: #cecece;
}

.problem-container {
  margin: auto;
  width: 100%;
  height: 100%;

  overflow-y: scroll;
  padding-bottom: 10px;
}

.manualpage-container {
  margin: auto;
  width: 100%;
  height: 100%;

  overflow-y: scroll;
  padding-bottom: 10px;
}

.pagination {
  list-style: none;
  font-size: 16px;
  user-select: none; /* Standard */
  display: block;
}

.pagination li {
  display: inline;
  border: 1px solid black;
  background-color: white;
  padding: 5px;
  margin: 1px;
  border-radius: 20%;
}

.pagination .active {
  background-color: #cca;
}

.manual-button-container {
  position: absolute;
  right: 15px;
  top: 10px;
}

.manual-button {
  background-color: white; /* Green */
  border: none;
  color: black;
}

.manual-button-active {
  color: green;
}
</style>
