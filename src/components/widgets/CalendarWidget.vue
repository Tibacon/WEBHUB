<template>
  <div class="calendar-widget">
    <div class="calendar-header">
      <button @click="previousMonth">‹</button>
      <div class="month-year">{{ currentMonth }}</div>
      <button @click="nextMonth">›</button>
    </div>
    <div class="calendar-grid-container">
      <div class="calendar-grid">
        <div class="day-name" v-for="day in dayNames" :key="day">{{ day }}</div>
        <div
          v-for="date in calendarDates"
          :key="date.id"
          class="calendar-day"
          :class="{
            today: date.isToday,
            'other-month': date.otherMonth,
            'has-events': date.hasEvents
          }"
          @click="!date.otherMonth && selectDate(date)"
        >
          <div class="day-number">{{ date.day }}</div>
          <div v-if="date.eventCount > 0" class="event-indicator">{{ date.eventCount }}</div>
        </div>
      </div>

      <div v-if="selectedDate" class="events-panel" @click.stop>
      <div class="events-header">
        <span>{{ selectedDateString }}</span>
        <button @click.stop="selectedDate = null" class="close-btn">
          <X :size="16" />
        </button>
      </div>
      <div class="events-list">
        <div v-for="event in selectedDateEvents" :key="event.id" class="event-item" :class="'event-' + event.type">
          <div class="event-content">
            <span class="event-text">{{ event.text }}</span>
            <span v-if="event.time" class="event-time">{{ event.time }}</span>
          </div>
          <button @click.stop="deleteEvent(event.id)" class="delete-event">
            <X :size="14" />
          </button>
        </div>
        <div v-if="selectedDateEvents.length === 0" class="no-events">
          Aucun événement
        </div>
      </div>
      <div class="add-event">
        <input
          v-model="newEventText"
          @keyup.enter="addEvent"
          @click.stop
          placeholder="Nouvel événement..."
          class="event-input"
        />
        <input
          v-model="newEventTime"
          type="time"
          @click.stop
          class="event-time-input"
        />
        <button @click.stop="addEvent" class="add-event-btn">
          <Plus :size="18" />
        </button>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWidgetsStore } from '../../stores/widgetsStore'
import { X, Plus } from 'lucide-vue-next'

const props = defineProps({
  widget: {
    type: Object,
    required: true
  }
})

const widgetsStore = useWidgetsStore()
const currentDate = ref(new Date())
const selectedDate = ref(null)
const events = ref([])
const newEventText = ref('')
const newEventTime = ref('')

const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

onMounted(() => {
  if (props.widget.data?.events && Array.isArray(props.widget.data.events)) {
    events.value = props.widget.data.events
  }
})

const currentMonth = computed(() => {
  return currentDate.value.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  })
})

const selectedDateString = computed(() => {
  if (!selectedDate.value) return ''
  return selectedDate.value.fullDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const selectedDateEvents = computed(() => {
  if (!selectedDate.value) return []
  const dateString = selectedDate.value.fullDate.toDateString()
  return events.value.filter(e => new Date(e.date).toDateString() === dateString)
})

function getEventsForDate(date) {
  const dateString = date.toDateString()
  return events.value.filter(e => new Date(e.date).toDateString() === dateString)
}

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const today = new Date()

  const dates = []
  let dayOfWeek = firstDay.getDay()
  dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1

  // Previous month days
  for (let i = dayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    dates.push({
      id: `prev-${i}`,
      day: date.getDate(),
      otherMonth: true,
      isToday: false,
      hasEvents: false,
      eventCount: 0
    })
  }

  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    const dateEvents = getEventsForDate(date)
    dates.push({
      id: `curr-${i}`,
      day: i,
      otherMonth: false,
      isToday: date.toDateString() === today.toDateString(),
      fullDate: date,
      hasEvents: dateEvents.length > 0,
      eventCount: dateEvents.length
    })
  }

  return dates
})

function selectDate(date) {
  selectedDate.value = date
  newEventText.value = ''
  newEventTime.value = ''
}

function addEvent() {
  if (!newEventText.value.trim() || !selectedDate.value) return

  events.value.push({
    id: Date.now(),
    text: newEventText.value,
    time: newEventTime.value,
    date: selectedDate.value.fullDate.toISOString(),
    type: 'manual'
  })

  newEventText.value = ''
  newEventTime.value = ''
  saveData()
}

function deleteEvent(id) {
  events.value = events.value.filter(e => e.id !== id)
  saveData()
}

function saveData() {
  widgetsStore.updateWidgetData(props.widget.id, { events: events.value })
}

function previousMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}
</script>

<style scoped>
.calendar-widget {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
  overflow: hidden;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.calendar-header button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.2s;
}

.calendar-header button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.month-year {
  color: #fff;
  font-weight: 600;
  text-transform: capitalize;
  font-size: 14px;
}

.calendar-grid-container {
  flex: 1;
  min-height: 0;
  position: relative;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  height: 100%;
}

.day-name {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  text-align: center;
  padding: 4px;
  font-weight: 600;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
  flex-direction: column;
  gap: 2px;
}

.calendar-day:hover {
  background: rgba(255, 255, 255, 0.1);
}

.calendar-day.today {
  background: rgba(100, 108, 255, 0.6);
  font-weight: 700;
}

.calendar-day.other-month {
  opacity: 0.3;
  cursor: default;
}

.calendar-day.has-events {
  border: 2px solid var(--accent);
}

.day-number {
  font-size: 12px;
}

.event-indicator {
  font-size: 9px;
  background: var(--accent);
  color: white;
  border-radius: 10px;
  padding: 1px 5px;
  font-weight: 600;
}

.events-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px;
  background: rgba(20, 20, 30, 0.98);
  border: 2px solid var(--accent);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.events-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.events-header span {
  font-size: 12px;
  color: #fff;
  font-weight: 500;
  text-transform: capitalize;
}

.close-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  border-radius: 4px;
}

.close-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 120px;
  overflow-y: auto;
}

.event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid var(--accent);
  border-radius: 4px;
  gap: 8px;
}

.event-item.event-todo {
  border-left-color: #10b981;
}

.event-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-text {
  color: #fff;
  font-size: 12px;
}

.event-time {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
}

.delete-event {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border-radius: 4px;
}

.delete-event:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.no-events {
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  text-align: center;
  padding: 12px;
}

.add-event {
  display: flex;
  gap: 6px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.event-input {
  flex: 1;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 4px;
  outline: none;
  font-size: 12px;
}

.event-input:focus {
  border-color: var(--accent);
}

.event-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.event-time-input {
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 4px;
  outline: none;
  font-size: 12px;
  width: 80px;
}

.event-time-input:focus {
  border-color: var(--accent);
}

.add-event-btn {
  padding: 6px 12px;
  background: var(--accent);
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.add-event-btn:hover {
  background: var(--accent-hover);
}

/* Scrollbar styling */
.events-panel::-webkit-scrollbar,
.events-list::-webkit-scrollbar {
  width: 4px;
}

.events-panel::-webkit-scrollbar-track,
.events-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.events-panel::-webkit-scrollbar-thumb,
.events-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.events-panel::-webkit-scrollbar-thumb:hover,
.events-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
