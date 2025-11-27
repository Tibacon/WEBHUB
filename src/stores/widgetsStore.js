import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWidgetsStore = defineStore('widgets', () => {
  const widgets = ref([])

  // Charger les widgets depuis localStorage
  function loadWidgets() {
    const saved = localStorage.getItem('webhub_widgets')
    if (saved) {
      widgets.value = JSON.parse(saved)
    } else {
      // Configuration par défaut avec quelques widgets
      widgets.value = [
        {
          id: Date.now() + 1,
          type: 'clock',
          position: { x: 0, y: 0 },
          size: { width: 2, height: 2 }
        },
        {
          id: Date.now() + 2,
          type: 'todo',
          position: { x: 2, y: 0 },
          size: { width: 2, height: 3 },
          data: { tasks: [] }
        },
        {
          id: Date.now() + 3,
          type: 'notes',
          position: { x: 0, y: 2 },
          size: { width: 2, height: 3 },
          data: { content: '' }
        }
      ]
      saveWidgets()
    }
  }

  // Sauvegarder dans localStorage
  function saveWidgets() {
    localStorage.setItem('webhub_widgets', JSON.stringify(widgets.value))
  }

  // Ajouter un widget
  function addWidget(type) {
    const newWidget = {
      id: Date.now(),
      type,
      position: { x: 0, y: 0 },
      size: { width: 2, height: 2 },
      data: {}
    }
    widgets.value.push(newWidget)
    saveWidgets()
    return newWidget
  }

  // Supprimer un widget
  function removeWidget(id) {
    widgets.value = widgets.value.filter(w => w.id !== id)
    saveWidgets()
  }

  // Mettre à jour la position d'un widget
  function updateWidgetPosition(id, position) {
    const widget = widgets.value.find(w => w.id === id)
    if (widget) {
      widget.position = position
      saveWidgets()
    }
  }

  // Mettre à jour la taille d'un widget
  function updateWidgetSize(id, size) {
    const widget = widgets.value.find(w => w.id === id)
    if (widget) {
      widget.size = size
      saveWidgets()
    }
  }

  // Mettre à jour les données d'un widget
  function updateWidgetData(id, data) {
    const widget = widgets.value.find(w => w.id === id)
    if (widget) {
      widget.data = { ...widget.data, ...data }
      saveWidgets()
    }
  }

  return {
    widgets,
    loadWidgets,
    addWidget,
    removeWidget,
    updateWidgetPosition,
    updateWidgetSize,
    updateWidgetData
  }
})
