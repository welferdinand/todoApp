<template>
  <div class="sidebar bg-light p-3 vh-100">
    <h4 class="mb-3">TodoApp</h4>
    <h5 class="mt-4">Tags</h5>
    <div class="form-check" v-for="tag in tags" :key="tag">
      <input
        class="form-check-input"
        type="checkbox"
        :value="tag"
        :id="'flexCheck' + tag"
        v-model="selectedTags"
        @change="emitSelectedTags"
      />
      <label class="form-check-label" :for="'flexCheck' + tag">
        {{ tag }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tags: ["Personal", "Work", "Sport", "Activity"],
      selectedTags: [],
    };
  },
  methods: {
    emitSelectedTags() {
      this.$emit('filter-tasks', this.selectedTags);
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
}
</style>
