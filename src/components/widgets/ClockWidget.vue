<template>
  <div class="clock-widget">
    <div class="time">{{ currentTime }}</div>
    <div class="date">{{ currentDate }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')
const currentDate = ref('')
let interval = null

function updateTime() {
  const now = new Date()

  // Format time (HH:MM:SS)
  currentTime.value = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  // Format date
  currentDate.value = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  updateTime()
  interval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.clock-widget {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  overflow: hidden;
}

.time {
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  font-family: 'Courier New', monospace;
}

.date {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  text-transform: capitalize;
}
</style>
