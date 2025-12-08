<template>
  <div class="todo-widget">
    <div class="todo-input">
      <input
        v-model="newTask"
        @keyup.enter="addTask"
        placeholder="Nouvelle tâche..."
        type="text"
      />
      <input
        v-model="newTaskDate"
        type="date"
        class="date-input"
      />
      <button @click="addTask" class="add-task-btn">
        <Plus :size="20" />
      </button>
    </div>
    <div class="todo-list">
      <div
        v-for="task in sortedTasks"
        :key="task.id"
        class="todo-item"
        :class="{ completed: task.completed, overdue: isOverdue(task) }"
      >
        <input
          type="checkbox"
          v-model="task.completed"
          @change="handleTaskToggle(task)"
        />
        <div class="task-content" @click="task.completed = !task.completed; handleTaskToggle(task)">
          <span class="task-text">{{ task.text }}</span>
          <span v-if="task.date" class="task-date">{{ formatDate(task.date) }}</span>
        </div>
        <button class="delete-btn" @click="removeTask(task.id)">
          <X :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWidgetsStore } from '../../stores/widgetsStore'
import { Plus, X } from 'lucide-vue-next'

const props = defineProps({
  widget: {
    type: Object,
    required: true
  }
})

const widgetsStore = useWidgetsStore()
const tasks = ref([])
const newTask = ref('')
const newTaskDate = ref('')

onMounted(() => {
  if (props.widget.data?.tasks) {
    tasks.value = props.widget.data.tasks
  }
})

const sortedTasks = computed(() => {
  return [...tasks.value].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    if (a.date && b.date) {
      return new Date(a.date) - new Date(b.date)
    }
    if (a.date) return -1
    if (b.date) return 1
    return 0
  })
})

function addTask() {
  if (newTask.value.trim()) {
    const task = {
      id: Date.now(),
      text: newTask.value,
      completed: false,
      date: newTaskDate.value || null
    }
    tasks.value.push(task)

    // Add to calendar if date is set
    if (newTaskDate.value) {
      addToCalendar(task)
    }

    newTask.value = ''
    newTaskDate.value = ''
    saveData()
  }
}

function handleTaskToggle(task) {
  saveData()
  syncWithCalendar(task)
}

function removeTask(id) {
  const task = tasks.value.find(t => t.id === id)
  tasks.value = tasks.value.filter(t => t.id !== id)

  // Remove from calendar
  if (task && task.date) {
    removeFromCalendar(task)
  }

  saveData()
}

function addToCalendar(task) {
  const calendarWidget = widgetsStore.widgets.find(w => w.type === 'calendar')
  if (!calendarWidget) return

  const events = calendarWidget.data?.events || []
  events.push({
    id: `todo-${task.id}`,
    text: task.text,
    date: new Date(task.date).toISOString(),
    type: 'todo',
    todoId: task.id
  })

  widgetsStore.updateWidgetData(calendarWidget.id, { events })
}

function removeFromCalendar(task) {
  const calendarWidget = widgetsStore.widgets.find(w => w.type === 'calendar')
  if (!calendarWidget) return

  const events = (calendarWidget.data?.events || []).filter(e => e.todoId !== task.id)
  widgetsStore.updateWidgetData(calendarWidget.id, { events })
}

function syncWithCalendar(task) {
  const calendarWidget = widgetsStore.widgets.find(w => w.type === 'calendar')
  if (!calendarWidget || !task.date) return

  const events = calendarWidget.data?.events || []
  const eventIndex = events.findIndex(e => e.todoId === task.id)

  if (eventIndex !== -1) {
    events[eventIndex].text = task.completed ? `✓ ${task.text}` : task.text
    widgetsStore.updateWidgetData(calendarWidget.id, { events })
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return "Aujourd'hui"
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Demain'
  } else {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }
}

function isOverdue(task) {
  if (!task.date || task.completed) return false
  const taskDate = new Date(task.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return taskDate < today
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
  overflow: hidden;
}

.todo-input {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.todo-input input[type="text"] {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 6px;
  outline: none;
  font-size: 13px;
}

.todo-input input[type="text"]::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.todo-input input[type="text"]:focus {
  border-color: var(--accent);
}

.date-input {
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 6px;
  outline: none;
  font-size: 13px;
  width: 135px;
}

.date-input:focus {
  border-color: var(--accent);
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

.add-task-btn {
  padding: 8px 12px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.add-task-btn:hover {
  background: var(--accent-hover);
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  flex-shrink: 0;
}

.todo-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.completed .task-text {
  text-decoration: line-through;
}

.todo-item.overdue {
  border-left-color: #ef4444;
}

.todo-item input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.task-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
}

.task-text {
  color: #fff;
  font-size: 13px;
}

.task-date {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
}

.delete-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* Scrollbar styling */
.todo-list::-webkit-scrollbar {
  width: 6px;
}

.todo-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.todo-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.todo-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
