<template>
  <div class="todo-widget">
    <div class="todo-input">
      <input
        v-model="newTask"
        @keyup.enter="addTask"
        placeholder="Nouvelle tâche..."
        type="text"
      />
      <button @click="addTask">+</button>
    </div>
    <div class="todo-list">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="todo-item"
        :class="{ completed: task.completed }"
      >
        <input
          type="checkbox"
          v-model="task.completed"
          @change="saveData"
        />
        <span @click="task.completed = !task.completed; saveData()">
          {{ task.text }}
        </span>
        <button class="delete-btn" @click="removeTask(task.id)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWidgetsStore } from '../../stores/widgetsStore'

const props = defineProps({
  widget: {
    type: Object,
    required: true
  }
})

const widgetsStore = useWidgetsStore()
const tasks = ref([])
const newTask = ref('')

onMounted(() => {
  if (props.widget.data?.tasks) {
    tasks.value = props.widget.data.tasks
  }
})

function addTask() {
  if (newTask.value.trim()) {
    tasks.value.push({
      id: Date.now(),
      text: newTask.value,
      completed: false
    })
    newTask.value = ''
    saveData()
  }
}

function removeTask(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)
  saveData()
}

function saveData() {
  widgetsStore.updateWidgetData(props.widget.id, { tasks: tasks.value })
}
</script>

<style scoped>
.todo-widget {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.todo-input {
  display: flex;
  gap: 8px;
}

.todo-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 6px;
  outline: none;
}

.todo-input input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.todo-input button {
  padding: 8px 16px;
  background: rgba(100, 108, 255, 0.6);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.2s;
}

.todo-input button:hover {
  background: rgba(100, 108, 255, 0.8);
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex: 1;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  transition: background 0.2s;
}

.todo-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.todo-item.completed span {
  text-decoration: line-through;
  opacity: 0.6;
}

.todo-item input[type="checkbox"] {
  cursor: pointer;
}

.todo-item span {
  flex: 1;
  color: #fff;
  cursor: pointer;
}

.delete-btn {
  background: rgba(255, 0, 0, 0.2);
  border: none;
  color: #fff;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background: rgba(255, 0, 0, 0.4);
}
</style>
