import { defineStore } from 'pinia'
import { ref } from 'vue'
import { STORAGE_KEYS } from '../constants'

const DEFAULT_COLORS = {
  primary: '#646cff',
  secondary: '#42b883',
  background: '#242424',
  text: '#ffffff'
}

export const useThemeStore = defineStore('theme', () => {
  const background = ref('')
  const theme = ref('default')
  const customColors = ref({ ...DEFAULT_COLORS })

  /**
   * Validate URL format (basic check)
   * @param {string} url - URL to validate
   * @returns {boolean} True if URL is valid
   */
  function isValidUrl(url) {
    if (!url) return true // Empty is valid (removes background)
    try {
      const parsedUrl = new URL(url)
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
    } catch {
      return false
    }
  }

  /**
   * Load theme preferences from localStorage
   */
  function loadTheme() {
    try {
      const savedBg = localStorage.getItem(STORAGE_KEYS.BACKGROUND)
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)

      if (savedBg && isValidUrl(savedBg)) {
        background.value = savedBg
      }

      if (savedTheme) {
        theme.value = savedTheme
      }

      applyTheme()
    } catch (error) {
      console.error('Error loading theme:', error)
    }
  }

  /**
   * Apply theme to document
   * Updates background image and styles on the app element
   */
  function applyTheme() {
    const appElement = document.querySelector('.app')
    if (!appElement) {
      console.warn('App element not found')
      return
    }

    if (background.value) {
      appElement.style.backgroundImage = `url(${background.value})`
      appElement.style.backgroundSize = 'cover'
      appElement.style.backgroundPosition = 'center'
      appElement.style.backgroundAttachment = 'fixed'
    } else {
      appElement.style.backgroundImage = ''
    }
  }

  /**
   * Set background image
   * @param {string} url - Background image URL (empty string to remove)
   * @returns {boolean} Success status
   */
  function setBackground(url) {
    if (!isValidUrl(url)) {
      console.error('Invalid background URL:', url)
      return false
    }

    try {
      background.value = url
      localStorage.setItem(STORAGE_KEYS.BACKGROUND, url)
      applyTheme()
      return true
    } catch (error) {
      console.error('Error setting background:', error)
      return false
    }
  }

  /**
   * Set theme
   * @param {string} newTheme - Theme name
   */
  function setTheme(newTheme) {
    try {
      theme.value = newTheme
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme)
    } catch (error) {
      console.error('Error setting theme:', error)
    }
  }

  /**
   * Update custom colors
   * @param {Object} colors - Color values to update
   */
  function setCustomColors(colors) {
    try {
      customColors.value = { ...customColors.value, ...colors }
      localStorage.setItem('webhub_colors', JSON.stringify(customColors.value))
    } catch (error) {
      console.error('Error setting custom colors:', error)
    }
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
