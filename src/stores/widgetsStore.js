import { defineStore } from 'pinia'
import { ref } from 'vue'
import { STORAGE_KEYS, DEFAULT_WIDGET_SIZE, WIDGET_SIZE_LIMITS } from '../constants'

export const useWidgetsStore = defineStore('widgets', () => {
  const widgets = ref([])

  /**
   * Load widgets from localStorage
   * Falls back to default widgets if loading fails or no data exists
   */
  function loadWidgets() {
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
  }

  /**
   * Load default widget configuration
   * Creates a starter layout with clock, todo, and notes widgets
   */
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
   * Save widgets to localStorage
   * @returns {boolean} Success status
   */
  function saveWidgets() {
    try {
      localStorage.setItem(STORAGE_KEYS.WIDGETS, JSON.stringify(widgets.value))
      return true
    } catch (error) {
      console.error('Error saving widgets:', error)
      return false
    }
  }

  /**
   * Add a new widget to the dashboard
   * @param {string} type - Widget type (clock, todo, notes, weather, news, calendar)
   * @returns {Object} The newly created widget
   */
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

  /**
   * Remove a widget from the dashboard
   * @param {number} id - Widget ID to remove
   */
  function removeWidget(id) {
    widgets.value = widgets.value.filter(w => w.id !== id)
    saveWidgets()
  }

  /**
   * Update widget position
   * @param {number} id - Widget ID
   * @param {Object} position - New position {x, y}
   */
  function updateWidgetPosition(id, position) {
    const widget = widgets.value.find(w => w.id === id)
    if (widget) {
      widget.position = position
      saveWidgets()
    }
  }

  /**
   * Update widget size with validation
   * @param {number} id - Widget ID
   * @param {Object} size - New size {width, height}
   */
  function updateWidgetSize(id, size) {
    const widget = widgets.value.find(w => w.id === id)
    if (widget) {
      // Validate size constraints
      const validatedSize = {
        width: Math.max(WIDGET_SIZE_LIMITS.MIN, Math.min(WIDGET_SIZE_LIMITS.MAX, size.width)),
        height: Math.max(WIDGET_SIZE_LIMITS.MIN, Math.min(WIDGET_SIZE_LIMITS.MAX, size.height))
      }
      widget.size = validatedSize
      saveWidgets()
    }
  }

  /**
   * Update widget data
   * @param {number} id - Widget ID
   * @param {Object} data - Data to merge with existing widget data
   */
  function updateWidgetData(id, data) {
    const widget = widgets.value.find(w => w.id === id)
    if (widget) {
      widget.data = { ...widget.data, ...data }
      saveWidgets()
    }
  }

  /**
   * Reorder widgets (for drag & drop)
   * @param {number} oldIndex - Original index
   * @param {number} newIndex - New index
   */
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
