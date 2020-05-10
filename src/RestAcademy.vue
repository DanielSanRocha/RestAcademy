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
          v-model="currentPage"
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
    currentPage: 1,
    currentManualPage: 1
  }),
  mounted: function() {
    this.setCurrentProblemUrl();
    this.setCurrentManualPageUrl();
  },
  methods: {
    toggleManual() {
      this.manual = !this.manual;
    },
    onProblemPageChanged: function() {
      this.setCurrentProblemUrl();
    },
    onManualPageChanged: function() {
      this.setCurrentManualPageUrl();
    },
    setCurrentProblemUrl() {
      let currentPage = this.currentPage ? this.currentPage : 1;
      this.currentProblemUrl = this.problemsUrl[currentPage - 1];
    },
    setCurrentManualPageUrl() {
      let currentManualPage = this.currentManualPage
        ? this.currentManualPage
        : 1;
      this.currentManualPageUrl = this.manualPagesUrl[currentManualPage - 1];
    }
  }
};
</script>

<style>
.manual-or-problem-container {
  flex-direction: column;
  display: flex;
  height: 100%;

  overflow-y: scroll;
}

.rest-academy-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.pagination-container {
  /* margin: auto; */
  margin: 50px auto 0 auto;
}

.problem-container {
  margin: auto;
  width: 100%;
  height: 100%;
}

.manualpage-container {
  margin: auto;
  width: 100%;
  height: 100%;
}

.pagination {
  list-style: none;
  font-size: 16px;
  user-select: none; /* Standard */
  display: block;
}

.pagination li {
  display: inline;
  border: 1px solid #ccc;
  padding: 5px;
  margin: 1px;
  border-radius: 20%;
}

.pagination .active {
  background-color: #ccc;
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
