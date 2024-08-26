<template>
  <div class="app-container d-flex">
    <Sidebar />
    <div class="content p-3">
      <h2>
        To Do List
        <button
          type="button"
          class="btn btm-sm btn-primary ms-3"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          @click="openAddModal"
        >
          <fa icon="plus" />
        </button>
      </h2>
      <!-- Modal for Add/Edit Task -->
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                {{ isEditMode ? 'Edit Task' : 'Add New Task' }}
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="isEditMode ? updateTask() : addTask()">
                <div class="mb-3">
                  <label for="task-name" class="col-form-label"
                    >Task Name:</label
                  >
                  <input
                    v-model="currentTask.name"
                    type="text"
                    class="form-control"
                    id="task-name"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="task-description" class="col-form-label"
                    >Description:</label
                  >
                  <textarea
                    v-model="currentTask.description"
                    class="form-control"
                    id="task-description"
                    required
                  ></textarea>
                </div>
                <div class="mb-3">
                  <label class="col-form-label">Status:</label>
                  <div class="form-check">
                    <input
                      v-model="currentTask.status"
                      class="form-check-input"
                      type="radio"
                      value="not yet started"
                      id="status-not-started"
                      required
                    />
                    <label class="form-check-label" for="status-not-started">
                      not yet started
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      v-model="currentTask.status"
                      class="form-check-input"
                      type="radio"
                      value="in progress"
                      id="status-in-progress"
                      required
                    />
                    <label class="form-check-label" for="status-in-progress">
                      in progress
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      v-model="currentTask.status"
                      class="form-check-input"
                      type="radio"
                      value="done"
                      id="status-done"
                      required
                    />
                    <label class="form-check-label" for="status-done">
                      done
                    </label>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="col-form-label">Tags:</label>
                  <div class="form-check">
                    <input
                      v-model="currentTask.tags"
                      class="form-check-input"
                      type="radio"
                      value="Personal"
                      id="tag-personal"
                      required
                    />
                    <label class="form-check-label" for="tag-personal">
                      Personal
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      v-model="currentTask.tags"
                      class="form-check-input"
                      type="radio"
                      value="Work"
                      id="tag-work"
                      required
                    />
                    <label class="form-check-label" for="tag-work">
                      Work
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      v-model="currentTask.tags"
                      class="form-check-input"
                      type="radio"
                      value="Sport"
                      id="tag-sport"
                      required
                    />
                    <label class="form-check-label" for="tag-sport">
                      Sport
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      v-model="currentTask.tags"
                      class="form-check-input"
                      type="radio"
                      value="Activity"
                      id="tag-activity"
                      required
                    />
                    <label class="form-check-label" for="tag-activity">
                      Activity
                    </label>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" class="btn btn-primary">
                    {{ isEditMode ? 'Update Task' : 'Add Task' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <TodoList :tasks="tasks" @edit-task="openEditModal" @delete-task="deleteTask"/>
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar.vue";
import TodoList, { getTasks } from "./components/TodoList.vue";
import { onMounted, ref } from "vue";
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { database } from "./firebase";

export default {
  components: {
    Sidebar,
    TodoList,
  },
  setup() {
    const tasks = ref([]);
    const currentTask = ref({
      name: "",
      description: "",
      status: "not yet started",
      tags: "Personal",
    });
    const isEditMode = ref(false);
    let editingTaskId = null;

    // Open Add Modal
    const openAddModal = () => {
      currentTask.value = {
        name: "",
        description: "",
        status: "not yet started",
        tags: "Personal",
      };
      isEditMode.value = false;
      editingTaskId = null;
    };

    // Open Edit Modal and populate with task data
    const openEditModal = (task) => {
      currentTask.value = { ...task };
      isEditMode.value = true;
      editingTaskId = task.id;
    };

    // Add a new task
    const addTask = async () => {
      try {
        await addDoc(collection(database, "tasks"), {
          taskName: currentTask.value.name,
          description: currentTask.value.description,
          status: currentTask.value.status,
          tags: currentTask.value.tags,
        });

        getTasks(tasks);

        const modalElement = document.getElementById("exampleModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        alert("Task added successfully!");
      } catch (error) {
        console.error("Error adding task: ", error);
      }
    };

    // Update an existing task
    const updateTask = async () => {
      try {
        const taskRef = doc(database, "tasks", editingTaskId);
        await updateDoc(taskRef, {
          taskName: currentTask.value.name,
          description: currentTask.value.description,
          status: currentTask.value.status,
          tags: currentTask.value.tags,
        });

        getTasks(tasks);

        const modalElement = document.getElementById("exampleModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        alert("Task updated successfully!");
      } catch (error) {
        console.error("Error updating task: ", error);
      }
    };

    // Delete a task
    const deleteTask = async (taskId) => {
      try {
        const taskRef = doc(database, "tasks", taskId);
        await deleteDoc(taskRef);

        getTasks(tasks);

        alert("Task deleted successfully!");
      } catch (error) {
        console.error("Error deleting task: ", error);
      }
    };

    onMounted(() => {
      getTasks(tasks);
    });

    return {
      tasks,
      currentTask,
      isEditMode,
      openAddModal,
      openEditModal,
      addTask,
      updateTask,
      deleteTask,
    };
  },
};
</script>

<style>
.app-container {
  display: flex;
}
.content {
  flex-grow: 1;
}
</style>+
