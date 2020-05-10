<template>
  <div class="rest-academy-container">
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
        :click-handler="onPageChanged"
      ></paginate>
    </div>
  </div>
</template>

<script>
import Problem from "./components/Problem.vue";
import Paginate from "vuejs-paginate";

export default {
  name: "RestAcademy",
  props: ["problemsUrl"],
  components: {
    Problem,
    Paginate
  },
  data: () => ({ currentProblemUrl: undefined, currentPage: 1 }),
  mounted: function() {
    this.setCurrentProblemUrl();
  },
  methods: {
    onPageChanged: function() {
      this.setCurrentProblemUrl();
    },
    setCurrentProblemUrl() {
      let currentPage = this.currentPage ? this.currentPage : 1;
      this.currentProblemUrl = this.problemsUrl[currentPage - 1];
    }
  }
};
</script>

<style>
.rest-academy-container {
  flex-direction: column;
  display: flex;
  height: 100%;
}

.pagination-container {
  /* margin: auto; */
  margin: auto auto 0 auto;
}

.problem-container {
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
</style>
