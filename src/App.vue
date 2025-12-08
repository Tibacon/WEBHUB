<script setup>
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import WidgetGrid from './components/layout/WidgetGrid.vue'
import SettingsPanel from './components/ui/SettingsPanel.vue'
import { useThemeStore } from './stores/themeStore'

const themeStore = useThemeStore()
const { background } = storeToRefs(themeStore)

onMounted(() => {
  themeStore.loadTheme()
})

// Observer les changements de fond d'écran
watch(background, (newBg) => {
  const appElement = document.querySelector('.app')
  if (appElement) {
    if (newBg) {
      appElement.style.backgroundImage = `url(${newBg})`
      appElement.style.backgroundSize = 'cover'
      appElement.style.backgroundPosition = 'center'
      appElement.style.backgroundRepeat = 'no-repeat'
    } else {
      appElement.style.backgroundImage = ''
    }
  }
}, { immediate: true })
</script>

<template>
  <div class="app">
    <WidgetGrid />
    <SettingsPanel />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--bg-primary);
}
</style>
