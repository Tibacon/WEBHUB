<template>
  <div class="widget-wrapper" :style="widgetStyle">
    <div class="widget-header">
      <span class="widget-title">{{ widgetTitle }}</span>
      <button class="widget-remove" @click="$emit('remove', widget.id)">✕</button>
    </div>
    <div class="widget-content">
      <component :is="widgetComponent" :widget="widget" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ClockWidget from '../widgets/ClockWidget.vue'
import TodoWidget from '../widgets/TodoWidget.vue'
import NotesWidget from '../widgets/NotesWidget.vue'
import WeatherWidget from '../widgets/WeatherWidget.vue'
import NewsWidget from '../widgets/NewsWidget.vue'
import CalendarWidget from '../widgets/CalendarWidget.vue'

const props = defineProps({
  widget: {
    type: Object,
    required: true
  }
})

defineEmits(['remove'])

const widgetComponents = {
  clock: ClockWidget,
  todo: TodoWidget,
  notes: NotesWidget,
  weather: WeatherWidget,
  news: NewsWidget,
  calendar: CalendarWidget
}

const widgetTitles = {
  clock: 'Horloge',
  todo: 'To-Do List',
  notes: 'Notes',
  weather: 'Météo',
  news: 'Actualités',
  calendar: 'Calendrier'
}

const widgetComponent = computed(() => {
  return widgetComponents[props.widget.type] || null
})

const widgetTitle = computed(() => {
  return widgetTitles[props.widget.type] || 'Widget'
})

const widgetStyle = computed(() => {
  return {
    gridColumn: `span ${props.widget.size.width}`,
    gridRow: `span ${props.widget.size.height}`
  }
})
</script>

<style scoped>
.widget-wrapper {
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border);
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px var(--shadow);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.widget-wrapper:hover {
  border-color: var(--accent);
  box-shadow: 0 4px 12px var(--shadow);
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

.widget-title {
  font-weight: 500;
  font-size: 13px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.widget-remove {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 16px;
}

.widget-remove:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.widget-content {
  flex: 1;
  overflow: auto;
}
</style>
