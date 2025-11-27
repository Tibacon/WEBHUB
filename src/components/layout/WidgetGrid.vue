<template>
  <div class="widget-grid">
    <WidgetWrapper
      v-for="widget in widgets"
      :key="widget.id"
      :widget="widget"
      @remove="handleRemove"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWidgetsStore } from '../../stores/widgetsStore'
import WidgetWrapper from './WidgetWrapper.vue'

const widgetsStore = useWidgetsStore()
const { widgets } = storeToRefs(widgetsStore)

onMounted(() => {
  widgetsStore.loadWidgets()
})

function handleRemove(id) {
  widgetsStore.removeWidget(id)
}
</script>

<style scoped>
.widget-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .widget-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }
}
</style>
