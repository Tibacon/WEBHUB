<script setup>
import { onMounted, watch } from 'vue'
import { useUserStore } from './stores/userStore'
import { storeToRefs } from 'pinia'
import WidgetGrid from './components/layout/WidgetGrid.vue'
import SettingsPanel from './components/ui/SettingsPanel.vue'
import UserPanel from './components/ui/UserPanel.vue'
import { useThemeStore } from './stores/themeStore'

const themeStore = useThemeStore()
const { background } = storeToRefs(themeStore)
const userStore = useUserStore()

onMounted(() => {
  userStore.loadUser()
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
    <UserPanel />
    <SettingsPanel />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--bg-primary);
}
</style>
