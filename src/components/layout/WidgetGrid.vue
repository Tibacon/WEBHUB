<template>
  <div ref="gridRef" class="widget-grid">
    <WidgetWrapper
      v-for="widget in widgets"
      :key="widget.id"
      :widget="widget"
      :data-id="widget.id"
      @remove="handleRemove"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Sortable from 'sortablejs'
import { useWidgetsStore } from '../../stores/widgetsStore'
import WidgetWrapper from './WidgetWrapper.vue'

const widgetsStore = useWidgetsStore()
const { widgets } = storeToRefs(widgetsStore)
const gridRef = ref(null)

onMounted(() => {
  widgetsStore.loadWidgets()

  // Initialiser le drag & drop
  if (gridRef.value) {
    Sortable.create(gridRef.value, {
      animation: 150,
      ghostClass: 'widget-ghost',
      dragClass: 'widget-drag',
      handle: '.widget-header',
      onEnd: (evt) => {
        const oldIndex = evt.oldIndex
        const newIndex = evt.newIndex

        if (oldIndex !== newIndex) {
          widgetsStore.reorderWidgets(oldIndex, newIndex)
        }
      }
    })
  }
})

function handleRemove(id) {
  widgetsStore.removeWidget(id)
}
</script>

<style scoped>
.widget-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 250px;
  gap: 16px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 1200px) {
  .widget-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .widget-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .widget-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }
}

/* Styles pour le drag & drop */
:deep(.widget-ghost) {
  opacity: 0.4;
  background: var(--accent);
}

:deep(.widget-drag) {
  cursor: grabbing;
  transform: scale(1.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

:deep(.widget-header) {
  cursor: grab;
}

:deep(.widget-header:active) {
  cursor: grabbing;
}
</style>
