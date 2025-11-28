import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const background = ref('')
  const theme = ref('default')
  const customColors = ref({
    primary: '#646cff',
    secondary: '#42b883',
    background: '#242424',
    text: '#ffffff'
  })

  // Charger les préférences depuis localStorage
  function loadTheme() {
    const savedBg = localStorage.getItem('webhub_background')
    const savedTheme = localStorage.getItem('webhub_theme')
    const savedColors = localStorage.getItem('webhub_colors')

    if (savedBg) background.value = savedBg
    if (savedTheme) theme.value = savedTheme
    if (savedColors) {
      try {
        customColors.value = JSON.parse(savedColors)
      } catch (error) {
        console.error('Erreur lors du chargement des couleurs:', error)
      }
    }

    applyTheme()
  }

  // Appliquer le thème au document
  function applyTheme() {
    const appElement = document.querySelector('.app')
    if (appElement) {
      if (background.value) {
        appElement.style.backgroundImage = `url(${background.value})`
        appElement.style.backgroundSize = 'cover'
        appElement.style.backgroundPosition = 'center'
        appElement.style.backgroundAttachment = 'fixed'
      } else {
        appElement.style.backgroundImage = ''
      }
    }
  }

  // Changer le fond d'écran
  function setBackground(url) {
    background.value = url
    localStorage.setItem('webhub_background', url)
    applyTheme()
  }

  // Changer le thème
  function setTheme(newTheme) {
    theme.value = newTheme
    localStorage.setItem('webhub_theme', newTheme)
  }

  // Mettre à jour les couleurs personnalisées
  function setCustomColors(colors) {
    customColors.value = { ...customColors.value, ...colors }
    localStorage.setItem('webhub_colors', JSON.stringify(customColors.value))
  }

  return {
    background,
    theme,
    customColors,
    loadTheme,
    setBackground,
    setTheme,
    setCustomColors
  }
})
