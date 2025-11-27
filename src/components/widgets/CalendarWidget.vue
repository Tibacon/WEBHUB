<template>
  <div class="calendar-widget">
    <div class="calendar-header">
      <button @click="previousMonth">‹</button>
      <div class="month-year">{{ currentMonth }}</div>
      <button @click="nextMonth">›</button>
    </div>
    <div class="calendar-grid">
      <div class="day-name" v-for="day in dayNames" :key="day">{{ day }}</div>
      <div
        v-for="date in calendarDates"
        :key="date.id"
        class="calendar-day"
        :class="{ today: date.isToday, 'other-month': date.otherMonth }"
      >
        {{ date.day }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineProps({
  widget: {
    type: Object,
    required: true
  }
})

const currentDate = ref(new Date())
const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const currentMonth = computed(() => {
  return currentDate.value.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  })
})

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const today = new Date()

  const dates = []
  let dayOfWeek = firstDay.getDay()
  dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Adjust for Monday start

  // Previous month days
  for (let i = dayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    dates.push({
      id: `prev-${i}`,
      day: date.getDate(),
      otherMonth: true,
      isToday: false
    })
  }

  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    dates.push({
      id: `curr-${i}`,
      day: i,
      otherMonth: false,
      isToday: date.toDateString() === today.toDateString()
    })
  }

  return dates
})

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
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  flex: 1;
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
}
</style>
