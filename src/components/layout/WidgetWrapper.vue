<template>
  <div
    ref="wrapperRef"
    class="widget-wrapper"
    :style="widgetStyle"
  >
    <div class="widget-header">
      <span class="widget-title">{{ widgetTitle }}</span>
      <div class="widget-actions">
        <div class="widget-resize">
          <button class="widget-resize-btn" @click="toggleSizeMenu">
            <Settings :size="16" />
          </button>
          <div v-if="showSizeMenu" class="size-menu">
            <div class="size-section">
              <span class="size-label">Largeur</span>
              <div class="size-options">
                <button
                  v-for="w in [1, 2, 3, 4]"
                  :key="'w' + w"
                  :class="{ active: widget.size.width === w }"
                  @click="updateSize(w, widget.size.height)"
                >
                  {{ w }}
                </button>
              </div>
            </div>
            <div class="size-section">
              <span class="size-label">Hauteur</span>
              <div class="size-options">
                <button
                  v-for="h in [1, 2, 3, 4]"
                  :key="'h' + h"
                  :class="{ active: widget.size.height === h }"
                  @click="updateSize(widget.size.width, h)"
                >
                  {{ h }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <button class="widget-remove" @click="$emit('remove', widget.id)">
          <X :size="16" />
        </button>
      </div>
    </div>
    <div class="widget-content">
      <component :is="widgetComponent" :widget="widget" />
    </div>
    <div
      class="resize-handle"
      @mousedown="startResize"
      @click.stop
    ></div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useWidgetsStore } from '../../stores/widgetsStore'
import { X, Settings } from 'lucide-vue-next'
import ClockWidget from '../widgets/ClockWidget.vue'
import TodoWidget from '../widgets/TodoWidget.vue'
import NotesWidget from '../widgets/NotesWidget.vue'
import WeatherWidget from '../widgets/WeatherWidget.vue'
import NewsWidget from '../widgets/NewsWidget.vue'
import CalendarWidget from '../widgets/CalendarWidget.vue'
import QuotesWidget from '../widgets/QuotesWidget.vue'
import CryptoWidget from '../widgets/CryptoWidget.vue'

const props = defineProps({
  widget: {
    type: Object,
    required: true
  }
})

defineEmits(['remove'])

const widgetsStore = useWidgetsStore()
const showSizeMenu = ref(false)
const wrapperRef = ref(null)
const isResizing = ref(false)
const startPos = ref({ x: 0, y: 0 })
const startSize = ref({ width: 0, height: 0 })
const currentSize = ref({ width: 0, height: 0 })
const initialRect = ref(null)

function toggleSizeMenu() {
  showSizeMenu.value = !showSizeMenu.value
}

function updateSize(width, height) {
  widgetsStore.updateWidgetSize(props.widget.id, { width, height })
  showSizeMenu.value = false
}

function startResize(e) {
  e.preventDefault()
  e.stopPropagation()

  isResizing.value = true
  startPos.value = { x: e.clientX, y: e.clientY }
  startSize.value = {
    width: props.widget.size.width,
    height: props.widget.size.height
  }
  currentSize.value = { ...startSize.value }

  // Capturer la taille initiale du widget
  initialRect.value = wrapperRef.value.getBoundingClientRect()

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'nwse-resize'
  document.body.style.userSelect = 'none'
}

function handleResize(e) {
  if (!isResizing.value || !initialRect.value) return

  // Calculer le changement en pixels
  const deltaX = e.clientX - startPos.value.x
  const deltaY = e.clientY - startPos.value.y

  // Taille d'une cellule de grille basée sur la taille initiale
  const gridCellWidth = initialRect.value.width / startSize.value.width
  const gridCellHeight = initialRect.value.height / startSize.value.height

  // Calculer le nouveau nombre de cellules avec seuil
  const widthCells = deltaX / gridCellWidth
  const heightCells = deltaY / gridCellHeight

  // Utiliser un seuil de 0.5 pour éviter les changements trop fréquents
  let newWidth = startSize.value.width
  let newHeight = startSize.value.height

  if (Math.abs(widthCells) > 0.5) {
    newWidth = Math.max(1, Math.min(4, startSize.value.width + Math.round(widthCells)))
  }

  if (Math.abs(heightCells) > 0.5) {
    newHeight = Math.max(1, Math.min(4, startSize.value.height + Math.round(heightCells)))
  }

  // Mettre à jour uniquement si la taille a changé
  if (newWidth !== currentSize.value.width || newHeight !== currentSize.value.height) {
    currentSize.value = { width: newWidth, height: newHeight }
    widgetsStore.updateWidgetSize(props.widget.id, { width: newWidth, height: newHeight })
  }
}

function stopResize() {
  isResizing.value = false
  initialRect.value = null
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

const widgetComponents = {
  clock: ClockWidget,
  todo: TodoWidget,
  notes: NotesWidget,
  weather: WeatherWidget,
  news: NewsWidget,
  calendar: CalendarWidget,
  quotes: QuotesWidget,
  crypto: CryptoWidget
}

const widgetTitles = {
  clock: 'Horloge',
  todo: 'To-Do List',
  notes: 'Notes',
  weather: 'Météo',
  news: 'Actualités',
  calendar: 'Calendrier',
  quotes: 'Citations',
  crypto: 'Crypto'
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
  position: relative;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  min-height: 0;
}

.widget-wrapper:hover {
  transform: translateY(-4px);
  border-color: var(--border-hover);
  box-shadow: var(--shadow-hover);
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.widget-title {
  font-weight: 600;
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.widget-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.widget-resize {
  position: relative;
}

.widget-resize-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.widget-resize-btn:hover {
  background: rgba(100, 108, 255, 0.1);
  color: var(--accent);
}

.size-menu {
  position: absolute;
  top: 30px;
  right: 0;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 100;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.size-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.size-label {
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.size-options {
  display: flex;
  gap: 6px;
}

.size-options button {
  flex: 1;
  padding: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.size-options button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--accent);
}

.size-options button.active {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

.widget-remove {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.widget-remove:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.widget-content {
  flex: 1;
  overflow: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: nwse-resize;
  z-index: 10;
}

.resize-handle::after {
  content: '';
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 12px 12px;
  border-color: transparent transparent rgba(255, 255, 255, 0.3) transparent;
}

.resize-handle:hover::after {
  border-color: transparent transparent var(--accent) transparent;
}
</style>
