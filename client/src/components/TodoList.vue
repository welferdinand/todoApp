<template>
  <div class="template-list">
    <div class="row">
      <div v-for="task in tasks" :key="task.id" class="col-md-3">
        <TodoCard
          :taskName="task.taskName"
          :description="task.description"
          :status="task.status"
          :tags="task.tags"
          @edit-task="editTask"
          @delete-task="deleteTask"
          :taskId="task.id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TodoCard from "./TodoCard.vue";
import { onMounted, ref } from "vue";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { database } from "../firebase";

export const getTasks = async (tasks) => {
  try {
    const snapshot = await getDocs(collection(database, "tasks"));
    tasks.value = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

export default {
  components: {
    TodoCard,
  },
  setup() {
    const tasks = ref([]);
    const newTask = ref({
      name: "",
      description: "",
      status: "not yet started",
      tags: "Personal",
    });
    const isEditing = ref(false);
    const currentTaskId = ref(null);

    onMounted(() => {
      getTasks(tasks);
    });

    const deleteTask = async (taskId) => {
      try {
        await deleteDoc(doc(database, "tasks", taskId));
        await getTasks(tasks);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    };

    const editTask = (task) => {
      newTask.value = { ...task };
      currentTaskId.value = task.id;
      isEditing.value = true;

      // Open the modal programmatically if using a modal
      const modalElement = document.getElementById("exampleModal");
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    };

    const saveTask = async () => {
      try {
        const taskRef = doc(database, "tasks", currentTaskId.value);
        await updateDoc(taskRef, {
          taskName: newTask.value.name,
          description: newTask.value.description,
          status: newTask.value.status,
          tags: newTask.value.tags,
        });

        isEditing.value = false;
        currentTaskId.value = null;
        newTask.value = {
          name: "",
          description: "",
          status: "not yet started",
          tags: "Personal",
        };

        await getTasks(tasks);

        const modalElement = document.getElementById("exampleModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
      } catch (error) {
        console.error("Error saving task:", error);
      }
    };

    return { tasks, deleteTask, editTask, saveTask, isEditing, newTask };
  },
};
</script>
