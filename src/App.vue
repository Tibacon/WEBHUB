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
  console.log('Background changed to:', newBg)
  const appElement = document.querySelector('.app')
  console.log('App element:', appElement)
  if (appElement) {
    if (newBg) {
      console.log('Applying background image')
      appElement.style.backgroundImage = `url(${newBg})`
      appElement.style.backgroundSize = 'cover'
      appElement.style.backgroundPosition = 'center'
      appElement.style.backgroundRepeat = 'no-repeat'
    } else {
      console.log('Removing background image')
      appElement.style.backgroundImage = ''
    }
  } else {
    console.log('App element not found!')
  }
}, { immediate: true })
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>Welcome to your <span class="gradient-text">WEBHUB</span></h1>
      <p class="tagline">A place to organize your web experience</p>
    </header>
    <WidgetGrid />
    <SettingsPanel />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--bg-primary);
}

.app-header {
  text-align: center;
  padding: 24px 20px 16px;
}

.app-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.gradient-text {
  color: var(--accent);
  font-weight: 700;
}

.tagline {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 400;
}
</style>
