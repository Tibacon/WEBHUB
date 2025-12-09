import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { STORAGE_KEYS, supabase } from '../constants/index'
import { useUserStore } from './userStore'

// --- FONCTIONS UTILITAIRES ---
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 59, g: 130, b: 246 }
}

function adjustColor(hex, percent) {
  const rgb = hexToRgb(hex)
  const adjust = (value) => Math.max(0, Math.min(255, value + (value * percent / 100)))
  
  const r = Math.round(adjust(rgb.r)).toString(16).padStart(2, '0')
  const g = Math.round(adjust(rgb.g)).toString(16).padStart(2, '0')
  const b = Math.round(adjust(rgb.b)).toString(16).padStart(2, '0')
  
  return `#${r}${g}${b}`
}

const DEFAULT_COLORS = {
  primary: '#3b82f6',
  secondary: '#42b883',
  background: '#242424',
  text: '#ffffff'
}

export const useThemeStore = defineStore('theme', () => {
  // --- ACCÈS AUX AUTRES STORES ---
  const userStore = useUserStore()

  // --- STATE ---
  const background = ref('')
  const theme = ref('default')
  const customColors = ref({ ...DEFAULT_COLORS })

  // --- HELPERS ---

  /**
   * Helper pour mettre à jour Supabase sans répéter le code
   */
  async function updateProfile(column, value) {
    if (!userStore.user) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [column]: value })
        .eq('id', userStore.user.id)

      if (error) throw error
    } catch (err) {
      console.error(`Erreur sauvegarde Supabase (${column}):`, err.message)
    }
  }

  function isValidUrl(url) {
    if (!url) return true
    try {
      const parsedUrl = new URL(url)
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
    } catch {
      return false
    }
  }

  /**
   * Calcule et applique toutes les variables CSS dérivées
   */
  function applyCssVariables(color) {
    if (!color) return
    const root = document.documentElement

    // 1. Couleur principale
    root.style.setProperty('--accent', color)

    // 2. Couleur Hover (plus sombre -20%)
    const hoverColor = adjustColor(color, -20)
    root.style.setProperty('--accent-hover', hoverColor)

    // 3. Couleur Light (transparente 10%)
    const rgb = hexToRgb(color)
    root.style.setProperty('--accent-light', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`)
  }

  // --- ACTIONS ---

  /**
   * Charger le thème (Local + Cloud)
   */
  async function loadTheme() {
    // 1. Chargement LocalStorage (Immédiat)
    try {
      const savedBg = localStorage.getItem(STORAGE_KEYS.BACKGROUND)
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
      const savedColors = localStorage.getItem('webhub_colors')
      const legacyAccent = localStorage.getItem('webhub_accent_color')

      if (savedBg && isValidUrl(savedBg)) background.value = savedBg
      if (savedTheme) theme.value = savedTheme
      
      if (savedColors) {
        customColors.value = JSON.parse(savedColors)
      } else if (legacyAccent) {
        customColors.value.primary = legacyAccent
      }

      applyTheme()
    } catch (error) {
      console.error('Erreur chargement localStorage:', error)
    }

    // 2. Si connecté, on récupère la vérité depuis Supabase
    if (userStore.user) {
      await fetchSupabasePreferences()
    }
  }

  /**
   * Récupérer les préférences depuis la DB
   */
  async function fetchSupabasePreferences() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('background_url, accent_color')
        .eq('id', userStore.user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        // Background
        if (data.background_url) {
          background.value = data.background_url
          localStorage.setItem(STORAGE_KEYS.BACKGROUND, data.background_url)
        }

        // Accent Color
        if (data.accent_color) {
          customColors.value.primary = data.accent_color
          localStorage.setItem('webhub_accent_color', data.accent_color)
          // Important: On met à jour l'objet customColors complet
          localStorage.setItem('webhub_colors', JSON.stringify(customColors.value))
        }
        
        // On réapplique tout visuellement
        applyTheme()
      }
    } catch (err) {
      console.error('Erreur chargement Supabase:', err.message)
    }
  }

  /**
   * Appliquer le thème au DOM
   */
  function applyTheme() {
    const appElement = document.querySelector('.app') || document.body
    
    // Background
    if (background.value) {
      appElement.style.backgroundImage = `url(${background.value})`
      appElement.style.backgroundSize = 'cover'
      appElement.style.backgroundPosition = 'center'
      appElement.style.backgroundAttachment = 'fixed'
    } else {
      appElement.style.backgroundImage = ''
    }

    // Couleurs (Main + Hover + Light)
    if (customColors.value.primary) {
      applyCssVariables(customColors.value.primary)
    }
  }

  /**
   * Définir le background
   */
  function setBackground(url) {
    if (!isValidUrl(url)) return false

    try {
      background.value = url
      localStorage.setItem(STORAGE_KEYS.BACKGROUND, url)
      applyTheme() // Applique visuellement
      updateProfile('background_url', url) // Sauvegarde DB
      return true
    } catch (error) {
      console.error('Error setting background:', error)
      return false
    }
  }

  function setTheme(newTheme) {
    try {
      theme.value = newTheme
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme)
    } catch (error) {
      console.error('Error setting theme:', error)
    }
  }

  /**
   * Définir les couleurs
   */
  function setCustomColors(colors) {
    try {
      customColors.value = { ...customColors.value, ...colors }
      
      if (colors.primary) {
        // 1. Sauvegarde Local
        localStorage.setItem('webhub_accent_color', colors.primary)
        
        // 2. Application Visuelle (Variables CSS complètes)
        applyCssVariables(colors.primary)
        
        // 3. Sauvegarde Supabase
        updateProfile('accent_color', colors.primary)
      }

      localStorage.setItem('webhub_colors', JSON.stringify(customColors.value))
    } catch (error) {
      console.error('Error setting custom colors:', error)
    }
  }

  // --- WATCHER ---
  watch(() => userStore.user, (newUser) => {
    if (newUser) {
      fetchSupabasePreferences()
    }
  })

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