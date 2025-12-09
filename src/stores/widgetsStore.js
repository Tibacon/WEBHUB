import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { STORAGE_KEYS, DEFAULT_WIDGET_SIZE, WIDGET_SIZE_LIMITS, supabase } from '../constants/index'
import { useUserStore } from './userStore'

export const useWidgetsStore = defineStore('widgets', () => {
  // --- ACCÈS AU USER STORE ---
  const userStore = useUserStore()

  // --- STATE ---
  const widgets = ref([])

  // --- HELPERS DB ---

  /**
   * Sauvegarde les widgets dans Supabase (colonne JSONB)
   */
  async function saveToSupabase() {
    // On ne fait rien si l'utilisateur n'est pas connecté
    if (!userStore.user) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ widgets: widgets.value })
        .eq('id', userStore.user.id)

      if (error) throw error
    } catch (err) {
      console.error('Erreur sync widgets Supabase:', err.message)
    }
  }

  /**
   * Récupère les widgets depuis Supabase
   */
  async function fetchFromSupabase() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('widgets')
        .eq('id', userStore.user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data && data.widgets) {
        // On vérifie que c'est bien un tableau avant de l'appliquer
        if (Array.isArray(data.widgets) && data.widgets.length > 0) {
          widgets.value = data.widgets
          // On met à jour le local storage pour être synchro
          localStorage.setItem(STORAGE_KEYS.WIDGETS, JSON.stringify(widgets.value))
        } else if (widgets.value.length > 0) {
          // Cas particulier : Si la DB est vide (ex: nouveau compte) mais qu'on a des widgets locaux,
          // on envoie les widgets locaux vers le cloud pour ne pas perdre la config de l'utilisateur.
          saveToSupabase()
        }
      }
    } catch (err) {
      console.error('Erreur chargement widgets Supabase:', err.message)
    }
  }

  // --- ACTIONS ---

  /**
   * Load widgets (Hybrid: Local First -> Cloud Update)
   */
  async function loadWidgets() {
    // 1. Charge le LocalStorage (Immédiat)
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WIDGETS)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          widgets.value = parsed
        } else {
          throw new Error('Invalid widgets data format')
        }
      } else {
        loadDefaultWidgets()
      }
    } catch (error) {
      console.error('Error loading widgets:', error)
      loadDefaultWidgets()
    }

    // 2. Si connecté, on sync avec le Cloud
    if (userStore.user) {
      await fetchFromSupabase()
    }
  }

  function loadDefaultWidgets() {
    const timestamp = Date.now()
    widgets.value = [
      {
        id: timestamp + 1,
        type: 'clock',
        position: { x: 0, y: 0 },
        size: { width: 2, height: 2 },
        data: {}
      },
      {
        id: timestamp + 2,
        type: 'todo',
        position: { x: 2, y: 0 },
        size: { width: 2, height: 3 },
        data: { tasks: [] }
      },
      {
        id: timestamp + 3,
        type: 'notes',
        position: { x: 0, y: 2 },
        size: { width: 2, height: 3 },
        data: { notes: [] }
      }
    ]
    saveWidgets()
  }

  /**
   * Save widgets (Local + Cloud)
   * Cette fonction est appelée par toutes les actions de modification
   */
  function saveWidgets() {
    try {
      // 1. Sauvegarde Locale (Synchrone & Rapide)
      localStorage.setItem(STORAGE_KEYS.WIDGETS, JSON.stringify(widgets.value))
      
      // 2. Sauvegarde Cloud (Asynchrone & Silencieuse)
      saveToSupabase()
      
      return true
    } catch (error) {
      console.error('Error saving widgets:', error)
      return false
    }
  }

  function addWidget(type) {
    const newWidget = {
      id: Date.now(),
      type,
      position: { x: 0, y: 0 },
      size: { ...DEFAULT_WIDGET_SIZE, width: 2, height: 2 },
      data: {}
    }
    widgets.value.push(newWidget)
    saveWidgets()
    return newWidget
  }

  function removeWidget(id) {
    widgets.value = widgets.value.filter(w => w.id !== id)
    saveWidgets()
  }

  function updateWidgetPosition(id, position) {
    const widget = widgets.value.find(w => w.id === id)
    if (widget) {
      widget.position = position
      saveWidgets()
    }
  }

  function updateWidgetSize(id, size) {
    const widget = widgets.value.find(w => w.id === id)
    if (widget) {
      const validatedSize = {
        width: Math.max(WIDGET_SIZE_LIMITS.MIN, Math.min(WIDGET_SIZE_LIMITS.MAX, size.width)),
        height: Math.max(WIDGET_SIZE_LIMITS.MIN, Math.min(WIDGET_SIZE_LIMITS.MAX, size.height))
      }
      widget.size = validatedSize
      saveWidgets()
    }
  }

  function updateWidgetData(id, data) {
    const widget = widgets.value.find(w => w.id === id)
    if (widget) {
      widget.data = { ...widget.data, ...data }
      saveWidgets()
    }
  }

  function reorderWidgets(oldIndex, newIndex) {
    if (oldIndex < 0 || oldIndex >= widgets.value.length ||
        newIndex < 0 || newIndex >= widgets.value.length) {
      console.warn('Invalid reorder indices')
      return
    }

    const widgetsCopy = [...widgets.value]
    const [movedWidget] = widgetsCopy.splice(oldIndex, 1)
    widgetsCopy.splice(newIndex, 0, movedWidget)
    widgets.value = widgetsCopy
    saveWidgets()
  }

  // --- WATCHER ---
  // Dès que l'utilisateur se connecte, on récupère sa configuration Cloud
  watch(() => userStore.user, (newUser) => {
    if (newUser) {
      fetchFromSupabase()
    }
  })

  return {
    widgets,
    loadWidgets,
    addWidget,
    removeWidget,
    updateWidgetPosition,
    updateWidgetSize,
    updateWidgetData,
    reorderWidgets
  }
})