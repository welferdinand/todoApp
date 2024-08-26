<template>
  <div class="card template-card">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ taskName }}</h5>
      <p class="card-text">{{ description }}</p>
      <div class="d-flex align-items-center justify-content-between mt-auto">
        <div>
          <p class="card-text mb-1">
            <small class="text-muted">Status: {{ status }}</small>
            <span
              :class="statusDotClass"
              class="status-dot"
              aria-hidden="true"
            ></span>
          </p>
          <p class="card-text mb-1">Tags: {{ tags }}</p>
        </div>
        <div>
          <button class="btn btn-sm btn-warning me-1" @click="onEdit">
            <fa icon="pen-to-square"></fa>
          </button>
          <button class="btn btn-sm btn-danger" @click="onDelete">
            <fa icon="trash-can"></fa>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    taskName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: true,
    },
    taskId: {
      type: String,
      required: true,
    }
  },
  computed: {
    statusDotClass() {
      return {
        'status-dot--green': this.status === 'done',
        'status-dot--yellow': this.status === 'in progress',
        'status-dot--red': this.status === 'not yet started',
      };
    },
  },
  methods: {
    onEdit() {
      this.$emit('edit-task', {
        id: this.taskId,
        name: this.taskName,
        description: this.description,
        status: this.status,
        tags: this.tags
      });
    },
    onDelete() {
      this.$emit('delete-task', this.taskId);
    }
  }
};
</script>



<style scoped>
.template-card {
  margin-bottom: 1rem;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  height: 150px; 
}

.card-body {
  display: flex;
  flex-direction: column;
}

.status-dot {
  display: inline-block;
  width: 10px;
  height: 9px;
  border-radius: 50%;
  margin-left: 6px;
}

.status-dot--green {
  background-color: green;
}

.status-dot--yellow {
  background-color: yellow;
}

.status-dot--red {
  background-color: red;
}

.card-text {
  margin-bottom: 4px; 
}

.btn {
  padding: 0.25rem 0.5rem;
}

.btn-light {
  background-color: #f8f9fa;
}

.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.justify-content-between {
  justify-content: space-between;
}

.mt-auto {
  margin-top: auto;
}
</style>